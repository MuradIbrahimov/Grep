import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { addDocument } from "../redux/action/index";
import type { RootState } from "../redux/store";

// Types
interface MatchResult {
  matches: Array<{
    text: string;
    index: number;
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
  const [isLoading, setIsLoading] = useState(false);
  const [patternError, setPatternError] = useState<string | null>(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

  const handlePatternChange = async (value: string) => {
    setPattern(value);
    setPatternError(null);

    if (value.trim()) {
      try {
        const response = await fetch(`${API_BASE}/api/validate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pattern: value })
        });
        const data = await response.json();
        
        if (!data.valid) {
          setPatternError(data.error);
        }
      } catch (error) {
        setPatternError('Failed to validate pattern');
      }
    }
  };

  const testPattern = async () => {
    const currentDoc = documents[documents.length - 1];
    
    if (!currentDoc?.content) {
      alert('Please upload a document first');
      return;
    }

    if (!pattern.trim()) {
      alert('Please enter a regex pattern');
      return;
    }

    setIsLoading(true);
    setResults(null);

    try {
      const response = await fetch(`${API_BASE}/api/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pattern: pattern.trim(),
          content: currentDoc.content
        })
      });

      const data: MatchResult = await response.json();
      setResults(data);
      
    } catch (error) {
      setResults({
        matches: [],
        totalMatches: 0,
        success: false,
        error: 'Failed to connect to regex engine'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentDocument = documents[documents.length - 1];

  return (
    <main className="bg-slate-950 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-slate-900 p-6 rounded-lg shadow-lg border border-slate-800">
            <h2 className="text-xl font-semibold text-white mb-4">Upload Document</h2>
            
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
              accept=".txt,.log,.json,.csv,.md"
              onChange={handleFileChange}
            />
            
            <p className="mt-1 text-sm text-slate-500">
              Upload text files for regex processing
            </p>

            {/* Document info */}
            {currentDocument && (
              <div className="mt-4 p-2 bg-slate-800 rounded text-sm">
                <p className="text-slate-300">📄 {currentDocument.name}</p>
                <p className="text-slate-500">
                  {currentDocument.content.length} characters
                </p>
              </div>
            )}

            <div className="mt-6">
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Document Content
              </label>
              <textarea
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                rows={12}
                value={currentDocument?.content || ''}
                readOnly
                placeholder="Document content will appear here..."
              />
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-lg shadow-lg border border-slate-800">
            <h2 className="text-xl font-semibold text-white mb-4">Regex Pattern</h2>
            
            <div className="mb-4">
              <input
                type="text"
                value={pattern}
                onChange={(e) => handlePatternChange(e.target.value)}
                className={`w-full p-3 bg-slate-800 border rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 font-mono ${
                  patternError 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-slate-700 focus:ring-blue-500'
                } focus:border-transparent`}
                placeholder="Enter regex pattern... (e.g., \d+|[a-z]+@[a-z]+\.[a-z]+)"
              />
              
              {patternError && (
                <p className="mt-1 text-sm text-red-400">⚠️ {patternError}</p>
              )}
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-slate-500">
                💡 Flags support coming soon to custom engine
              </p>
            </div>

            <button 
              onClick={testPattern}
              disabled={isLoading || !!patternError || !pattern.trim() || !currentDocument}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '🔄 Testing...' : '🔍 Test Pattern'}
            </button>
          </div>

          <div className="bg-slate-900 p-6 rounded-lg shadow-lg border border-slate-800">
            <h2 className="text-xl font-semibold text-white mb-4">Results</h2>
            
            {results && (
              <div className="space-y-4">
                <div className="p-3 bg-slate-800 border border-slate-700 rounded-lg">
                  <h3 className="text-sm font-medium text-slate-300 mb-2">Summary</h3>
                  {results.success ? (
                    <div>
                      <p className="text-emerald-400">✅ {results.totalMatches} matches found</p>
                      {results.totalMatches > 0 && (
                        <p className="text-slate-400 text-sm mt-1">
                          Across {new Set(results.matches.map(m => m.line)).size} lines
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-red-400">❌ {results.error}</p>
                  )}
                </div>

                {results.success && results.matches.length > 0 && (
                  <div className="p-3 bg-slate-800 border border-slate-700 rounded-lg">
                    <h3 className="text-sm font-medium text-slate-300 mb-2">Matches</h3>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {results.matches.slice(0, 50).map((match, index) => (
                        <div key={index} className="text-sm">
                          <div className="flex items-start space-x-2">
                            <span className="text-slate-500 flex-shrink-0">Line {match.line}:</span>
                            <code className="text-emerald-400 bg-slate-900 px-2 py-1 rounded text-xs break-all">
                              {match.matchedPortion}
                            </code>
                          </div>
                        </div>
                      ))}
                      {results.matches.length > 50 && (
                        <p className="text-slate-500 text-sm">
                          ... and {results.matches.length - 50} more matches
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {results.success && results.matches.length === 0 && (
                  <div className="p-3 bg-slate-800 border border-slate-700 rounded-lg">
                    <p className="text-slate-500">No matches found for this pattern</p>
                  </div>
                )}
              </div>
            )}

            {!results && !isLoading && (
              <div className="space-y-4">
                <div className="p-3 bg-slate-800 border border-slate-700 rounded-lg">
                  <h3 className="text-sm font-medium text-slate-300 mb-2">Ready</h3>
                  <p className="text-slate-500">Upload a document and enter a pattern to test</p>
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