
import { useState } from "react";
import {Code, Copy} from "lucide-react";
import type { RegexAST } from "../../../../server/engine/constants";

interface JsonViewProps {
  data: RegexAST;
  title: string;
}

const JsonView: React.FC<JsonViewProps> = ({ data, title }) => {
  const [copied, setCopied] = useState<boolean>(false);
  
  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Code size={20} />
          <span>{title}</span>
        </h3>
        <button 
          onClick={copyToClipboard}
          className="flex items-center space-x-1 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm text-slate-300 transition-colors"
        >
          <Copy size={14} />
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="text-sm text-slate-300 overflow-auto max-h-96 bg-slate-950 p-3 rounded border border-slate-800">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};
export default JsonView;
