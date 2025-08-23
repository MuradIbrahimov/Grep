import React, { useState } from 'react';
import {Code, Eye } from 'lucide-react';
import JsonView from './JsonView';
import TreeNode, { nodeConfig, type NodeConfig } from './TreeNode';

// Your exact AST node types
export type RegexAST =
  | { type: "Sequence", elements: RegexAST[] }
  | { type: "Alternative", options: RegexAST[] }
  | { type: "Group", child: RegexAST, index: number }
  | { type: "Quantifier", quant: string, child: RegexAST }
  | { type: "Literal", value: string }
  | { type: "Digit" }           // for \d
  | { type: "Alpha" }          // for [a-zA-Z_]
  | { type: "Anchor", kind: "start" | "end" }
  | { type: "Wildcard" }
  | { type: "Word" } // for \w
  | { type: "CharClass", chars: string, negated?: boolean }
  | { type: "BackReference", index: number };

// Sample AST data using your structure
const sampleAST: RegexAST = {
  type: "Sequence",
  elements: [
    {
      type: "Quantifier",
      quant: "+",
      child: {
        type: "Word"
      }
    },
    {
      type: "Literal",
      value: "s"
    },
    {
      type: "Literal",
      value: "e"
    },
    {
      type: "Word"
    }
  ]
};

// Statistics interface
interface ASTStatistics {
  totalNodes: number;
  nodeTypes: Record<string, number>;
  maxDepth: number;
  literals: number;
  quantifiers: number;
  groups: number;
  alternatives: number;
}

// Props for ASTStats component
interface ASTStatsProps {
  ast: RegexAST;
}

// Statistics Component
const ASTStats: React.FC<ASTStatsProps> = ({ ast }) => {
  const calculateStats = (node: RegexAST): ASTStatistics => {
    const stats: ASTStatistics = {
      totalNodes: 0,
      nodeTypes: {},
      maxDepth: 0,
      literals: 0,
      quantifiers: 0,
      groups: 0,
      alternatives: 0
    };
    
    const traverse = (n: RegexAST, depth: number = 0): void => {
      stats.totalNodes++;
      stats.maxDepth = Math.max(stats.maxDepth, depth);
      stats.nodeTypes[n.type] = (stats.nodeTypes[n.type] || 0) + 1;
      
      // Count specific node types
      if (n.type === 'Literal') stats.literals++;
      if (n.type === 'Quantifier') stats.quantifiers++;
      if (n.type === 'Group') stats.groups++;
      if (n.type === 'Alternative') stats.alternatives++;
      
      // Get children based on node type
      let children: RegexAST[] = [];
      switch (n.type) {
        case 'Sequence':
          children = n.elements;
          break;
        case 'Alternative':
          children = n.options;
          break;
        case 'Quantifier':
        case 'Group':
          children = [n.child];
          break;
      }
      
      children.forEach((child: RegexAST) => traverse(child, depth + 1));
    };
    
    traverse(node);
    return stats;
  };

  const stats = calculateStats(ast);
  
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
        <Eye size={20} />
        <span>AST Statistics</span>
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-3 bg-slate-800 rounded-lg">
          <div className="text-2xl font-bold text-blue-400">{stats.totalNodes}</div>
          <div className="text-sm text-slate-400">Total Nodes</div>
        </div>
        <div className="text-center p-3 bg-slate-800 rounded-lg">
          <div className="text-2xl font-bold text-purple-400">{stats.maxDepth}</div>
          <div className="text-sm text-slate-400">Max Depth</div>
        </div>
        <div className="text-center p-3 bg-slate-800 rounded-lg">
          <div className="text-2xl font-bold text-green-400">{stats.literals}</div>
          <div className="text-sm text-slate-400">Literals</div>
        </div>
        <div className="text-center p-3 bg-slate-800 rounded-lg">
          <div className="text-2xl font-bold text-yellow-400">{stats.quantifiers}</div>
          <div className="text-sm text-slate-400">Quantifiers</div>
        </div>
      </div>

      {/* Additional stats row */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-slate-800 rounded-lg">
          <div className="text-2xl font-bold text-pink-400">{stats.groups}</div>
          <div className="text-sm text-slate-400">Groups</div>
        </div>
        <div className="text-center p-3 bg-slate-800 rounded-lg">
          <div className="text-2xl font-bold text-red-400">{stats.alternatives}</div>
          <div className="text-sm text-slate-400">Alternatives</div>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-semibold text-slate-300 mb-2">Node Type Distribution:</h4>
        <div className="space-y-2">
          {Object.entries(stats.nodeTypes).map(([type, count]: [string, number]) => {
            const config = nodeConfig[type] || { color: 'bg-gray-500' };
            const percentage = ((count / stats.totalNodes) * 100).toFixed(1);
            
            return (
              <div key={type} className="flex items-center space-x-2">
                <div className={`w-3 h-3 ${config.color} rounded`}></div>
                <span className="text-sm text-slate-300 flex-1">{type}</span>
                <span className="text-sm text-slate-400">{count} ({percentage}%)</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Tab configuration interface
interface TabConfig {
  id: string;
  label: string;
  icon: string | React.ComponentType<{ size: number }>;
}

// Pattern examples for your AST structure
const examplePatterns: Array<{pattern: string, ast: RegexAST, description: string}> = [
  {
    pattern: "\\w+",
    description: "One or more word characters",
    ast: {
      type: "Quantifier",
      quant: "+",
      child: { type: "Word" }
    }
  },
  {
    pattern: "^hello$",
    description: "Anchored literal match",
    ast: {
      type: "Sequence",
      elements: [
        { type: "Anchor", kind: "start" },
        { type: "Literal", value: "hello" },
        { type: "Anchor", kind: "end" }
      ]
    }
  },
  {
    pattern: "(cat|dog)",
    description: "Grouped alternatives",
    ast: {
      type: "Group",
      index: 1,
      child: {
        type: "Alternative",
        options: [
          { type: "Literal", value: "cat" },
          { type: "Literal", value: "dog" }
        ]
      }
    }
  }
];

// Main Visualizer Component
const RegexASTVisualizer: React.FC = () => {
  const [astData, setAstData] = useState<RegexAST>(sampleAST);
  const [inputJson, setInputJson] = useState<string>(JSON.stringify(sampleAST, null, 2));
  const [parseError, setParseError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('tree');

  const handleJsonChange = (value: string): void => {
    setInputJson(value);
    try {
      const parsed = JSON.parse(value) as RegexAST;
      setAstData(parsed);
      setParseError(null);
    } catch (error) {
      setParseError(error instanceof Error ? error.message : 'Unknown parsing error');
    }
  };

  const loadExample = (example: RegexAST): void => {
    setAstData(example);
    setInputJson(JSON.stringify(example, null, 2));
    setParseError(null);
  };

  const tabs: TabConfig[] = [
    { id: 'tree', label: 'Tree View', icon: '🌳' },
    { id: 'stats', label: 'Statistics', icon: Eye },
    { id: 'json', label: 'Raw JSON', icon: Code }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center space-x-3">
            <div className="text-blue-400 text-4xl">🌳</div>
            <span>Regex AST Visualizer</span>
          </h1>
          <p className="text-slate-400 text-lg">Visualize your regex Abstract Syntax Tree (Top-to-Bottom)</p>
        </div>

        {/* Example patterns */}
        <div className="mb-6 bg-slate-900 border border-slate-700 rounded-lg p-4 max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-3">Quick Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {examplePatterns.map((example, index) => (
              <button
                key={index}
                onClick={() => loadExample(example.ast)}
                className="text-left p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-600"
              >
                <code className="text-emerald-400 font-mono text-sm">{example.pattern}</code>
                <p className="text-slate-400 text-xs mt-1">{example.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-white mb-4">Input AST JSON</h2>
            <textarea
              value={inputJson}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleJsonChange(e.target.value)}
              className="w-full h-32 bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste your AST JSON here..."
            />
            {parseError && (
              <div className="mt-2 p-2 bg-red-900 border border-red-700 rounded text-red-300 text-sm">
                ❌ JSON Parse Error: {parseError}
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex justify-center">
          <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg">
            {tabs.map((tab: TabConfig) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                {typeof tab.icon === 'string' ? (
                  <span className="text-lg">{tab.icon}</span>
                ) : (
                  <tab.icon size={16} />
                )}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'tree' && !parseError && (
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center justify-center space-x-2">
                <span className="text-2xl">🌳</span>
                <span>AST Tree Structure (Top-to-Bottom)</span>
              </h2>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-8 overflow-x-auto">
                <div className="flex justify-center">
                  <TreeNode node={astData} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && !parseError && (
            <div className="max-w-4xl mx-auto">
              <ASTStats ast={astData} />
            </div>
          )}

          {activeTab === 'json' && !parseError && (
            <div className="max-w-4xl mx-auto">
              <JsonView data={astData} title="Formatted AST JSON" />
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 bg-slate-900 border border-slate-700 rounded-lg p-4 max-w-6xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Node Type Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(nodeConfig).map(([type, config]: [string, NodeConfig]) => (
              <div key={type} className="flex items-center space-x-3">
                <div className={`${config.color} text-white text-xs font-mono px-2 py-1 rounded flex items-center space-x-1`}>
                  <span>{config.icon}</span>
                  <span>{type}</span>
                </div>
                <span className="text-slate-400 text-sm">{config.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegexASTVisualizer;