import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { addDocument } from "../../redux/action/index";
import type { RootState } from "../../redux/store";
import { matchPattern } from "../../shared/lib/utils/patternMatcher"; 
import defaultTestContent from "../../../../testFiles/test.txt?raw";
import { tokenize } from "../../../../server/engine/tokenizer";
import { parseAlternatives } from "../../../../server/engine/parseAlternatives";
interface MatchResult {
  matches: Array<{
    text: string;
    line: number;
    matchedPortion: string;
  }>;
  totalMatches: number;
  success: boolean;
  error?: string;
}

const Main = () => {
  const dispatch = useDispatch();
  const documents = useSelector((state: RootState) => state.handleDocument);
  const [pattern, setPattern] = useState("");
  const [results, setResults] = useState<MatchResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [patternError, setPatternError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      const id = crypto.randomUUID();
      reader.onload = (event) => {
        dispatch(addDocument({ 
          id, 
          name: file.name, 
          content: event.target?.result as string 
        }));
      };
      reader.readAsText(file);
    }
  };

 const handleLoadExample = () => {
  const id = crypto.randomUUID();
  dispatch(
    addDocument({
      id,
      name: "test.txt", // hardcoded since it's not a real File
      content: defaultTestContent,
    })
  );
};


  const handlePatternChange = (value: string) => {
    const tokens = tokenize(value);
    const [ast] = parseAlternatives(tokens);
    setPattern(() => value);
    setPatternError(null);
    if (value.trim()) {
      try {
        matchPattern('', tokens, ast);
      } catch (error) {
        setPatternError(error instanceof Error ? error.message : 'Invalid pattern');
      }
    }
  };

  const processMatches = (content: string, pattern: string): MatchResult => {
    try {
      const tokens = tokenize(pattern);
      const [ast] = parseAlternatives(tokens);
      console.dir(ast, { depth: null });

      const lines = content.split('\n');
      const matches: any[] = [];
      let totalMatches = 0;

      lines.forEach((line, lineIndex) => {
        if (matchPattern(line, tokens, ast  )) {
          matches.push({
            text: line.trim(),
            line: lineIndex + 1,
            matchedPortion: line.trim() 
          });
          totalMatches++;
        }
      });

      return {
        matches,
        totalMatches,
        success: true
      };
    } catch (error) {
      return {
        matches: [],
        totalMatches: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Pattern matching failed'
      };
    }
  };

  const testPattern = () => {
    const currentDoc = documents[documents.length - 1];
    
    if (!currentDoc?.content) {
      alert('Please upload a document first');
      return;
    }

    if (!pattern.trim()) {
      alert('Please enter a regex pattern');
      return;
    }

    setIsProcessing(true);
    setResults(null);

    setTimeout(() => {
      try {
        const result = processMatches(currentDoc.content, pattern.trim());
        setResults(result);
      } catch (error) {
        setResults({
          matches: [],
          totalMatches: 0,
          success: false,
          error: 'Processing failed'
        });
      } finally {
        setIsProcessing(false);
      }
    }, 10);
  };

  const currentDocument = documents[documents.length - 1];

  return (
    <main className="bg-slate-950 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-slate-900 p-6 rounded-lg shadow-lg border border-slate-800">
            <h2 className="text-xl font-semibold text-white mb-4">📁 Upload Document</h2>
            <button
            onClick={handleLoadExample}
            className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 
                      text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 
                      transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <span>📄</span>
            <span>Load Example File</span>
          </button>

            <label 
              className="block mb-2 text-sm font-medium text-slate-300" 
              htmlFor="file_input"
            >
              Choose file
            </label>
            
            <input
              className="block w-full text-sm text-slate-300 border border-slate-700 rounded-lg cursor-pointer bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white file:hover:bg-blue-700 transition-colors"
              id="file_input"
              type="file"
              accept=".txt,.log,.json,.csv,.md,.js,.ts,.py"
              onChange={handleFileChange}
            />
            
            <p className="mt-1 text-sm text-slate-500">
              Upload text files for regex processing
            </p>

            {currentDocument && (
              <div className="mt-4 p-3 bg-slate-800 rounded border border-slate-700">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">📄</span>
                  <span className="text-slate-300 font-medium">{currentDocument.name}</span>
                </div>
                <div className="text-sm text-slate-500 space-y-1">
                  <p>{currentDocument.content.length.toLocaleString()} characters</p>
                  <p>{currentDocument.content.split('\n').length.toLocaleString()} lines</p>
                </div>
              </div>
            )}

            <div className="mt-6">
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Document Preview
              </label>
              <textarea
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                rows={12}
                value={currentDocument?.content.slice(0, 2000) + (currentDocument?.content.length > 2000 ? '\n\n... (truncated)' : '') || ''}
                readOnly
                placeholder="Document content will appear here..."
              />
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-lg shadow-lg border border-slate-800">
            <h2 className="text-xl font-semibold text-white mb-4">🔍 Your Custom Regex Engine</h2>
            
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Pattern
              </label>
              <input
                type="text"
                value={pattern}
                onChange={(e) => handlePatternChange(e.target.value)}
                className={`w-full p-3 bg-slate-800 border rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 font-mono ${
                  patternError 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-slate-700 focus:ring-blue-500'
                } focus:border-transparent`}
                placeholder="Enter your custom pattern..."
              />
              
              {patternError && (
                <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{patternError}</span>
                </p>
              )}
              
              {!patternError && pattern && (
                <p className="mt-2 text-sm text-emerald-400 flex items-center space-x-1">
                  <span>✅</span>
                  <span>Pattern looks valid</span>
                </p>
              )}
            </div>
            
            <div className="mb-6 p-3 bg-slate-800 rounded border border-slate-700">
              <h3 className="text-sm font-medium text-slate-300 mb-2">🚀 Engine Status</h3>
              <div className="text-sm text-slate-400 space-y-1">
                <p>✅ Using custom pattern matcher</p>
                <p>⚡ Client-side processing (no server needed)</p>
              </div>
            </div>

            <button 
              onClick={testPattern}
              disabled={isProcessing || !!patternError || !pattern.trim() || !currentDocument}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin">🔄</span>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>Test Pattern</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-900 p-6 rounded-lg shadow-lg border border-slate-800">
            <h2 className="text-xl font-semibold text-white mb-4">📊 Results</h2>
            
            {results && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
                  <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center space-x-2">
                    <span>📈</span>
                    <span>Summary</span>
                  </h3>
                  {results.success ? (
                    <div className="space-y-2">
                      <p className="text-emerald-400 flex items-center space-x-2">
                        <span>✅</span>
                        <span>{results.totalMatches} matches found</span>
                      </p>
                      {results.totalMatches > 0 && (
                        <p className="text-slate-400 text-sm">
                          Across {new Set(results.matches.map(m => m.line)).size} lines
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-red-400 flex items-center space-x-2">
                      <span>❌</span>
                      <span>{results.error}</span>
                    </p>
                  )}
                </div>

                {results.success && results.matches.length > 0 && (
                  <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
                    <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center space-x-2">
                      <span>🎯</span>
                      <span>Matches</span>
                    </h3>
                    <div className="max-h-96 overflow-y-auto space-y-3">
                      {results.matches.slice(0, 100).map((match, index) => (
                        <div key={index} className="p-2 bg-slate-900 rounded border border-slate-600">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-slate-500 text-xs bg-slate-700 px-2 py-1 rounded">
                              Line {match.line}
                            </span>
                          </div>
                          <code className="text-emerald-400 text-sm break-all block">
                            {match.matchedPortion}
                          </code>
                        </div>
                      ))}
                      {results.matches.length > 100 && (
                        <p className="text-slate-500 text-sm p-2 bg-slate-800 rounded text-center">
                          ... and {results.matches.length - 100} more matches
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {results.success && results.matches.length === 0 && (
                  <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg text-center">
                    <div className="text-slate-500 space-y-2">
                      <span className="text-2xl">🔍</span>
                      <p>No matches found for this pattern</p>
                      <p className="text-sm">Try a different pattern or check your document content</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!results && !isProcessing && (
              <div className="text-center py-8">
                <div className="text-slate-500 space-y-3">
                  <span className="text-4xl">🚀</span>
                  <h3 className="font-medium">Ready to Process</h3>
                  <p className="text-sm">Upload a document and enter a pattern to test your regex engine</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Main;