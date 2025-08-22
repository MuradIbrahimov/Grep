import React, { useState, useEffect, type JSX } from 'react';
import { ChevronDown, ChevronRight, Code, Eye, Copy } from 'lucide-react';

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

// Node configuration interface
interface NodeConfig {
  color: string;
  icon: string;
  description: string;
}

// Updated node configurations for your AST structure
const nodeConfig: Record<string, NodeConfig> = {
  Sequence: { color: 'bg-blue-600', icon: '→', description: 'Sequential matching' },
  Alternative: { color: 'bg-red-600', icon: '|', description: 'Alternative options' },
  Group: { color: 'bg-pink-600', icon: '()', description: 'Capturing group' },
  Quantifier: { color: 'bg-purple-600', icon: '*', description: 'Repetition modifier' },
  Literal: { color: 'bg-green-600', icon: 'A', description: 'Exact character match' },
  Digit: { color: 'bg-orange-600', icon: '\\d', description: 'Digit character [0-9]' },
  Alpha: { color: 'bg-cyan-600', icon: 'α', description: 'Alphabetic [a-zA-Z_]' },
  Anchor: { color: 'bg-teal-600', icon: '^$', description: 'Position anchor' },
  Wildcard: { color: 'bg-gray-600', icon: '.', description: 'Any character' },
  Word: { color: 'bg-yellow-600', icon: '\\w', description: 'Word character' },
  CharClass: { color: 'bg-indigo-600', icon: '[]', description: 'Character class' },
  BackReference: { color: 'bg-rose-600', icon: '\\1', description: 'Back reference' }
};

// Props for TreeNode component
interface TreeNodeProps {
  node: RegexAST;
  level?: number;
  isLast?: boolean;
  path?: number[];
  parentWidth?: number;
  xOffset?: number;
}

// Tree Node Component - Now renders top to bottom
const TreeNode: React.FC<TreeNodeProps> = ({ 
  node, 
  level = 0, 
  isLast = true, 
  path = [],
  parentWidth = 0,
  xOffset = 0
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const config = nodeConfig[node.type] || { 
    color: 'bg-gray-500', 
    icon: '?', 
    description: 'Unknown type' 
  };
  
  // Determine children based on node type
  const getChildren = (node: RegexAST): RegexAST[] => {
    switch (node.type) {
      case 'Sequence':
        return node.elements;
      case 'Alternative':
        return node.options;
      case 'Quantifier':
      case 'Group':
        return [node.child];
      default:
        return [];
    }
  };

  const children = getChildren(node);
  const hasChildren = children.length > 0;

  const toggleExpanded = (): void => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  // Get node-specific properties for display
  const getNodeProperties = (node: RegexAST): JSX.Element[] => {
    const properties: JSX.Element[] = [];
    
    // Handle different node types
    switch (node.type) {
      case 'Literal':
        properties.push(
          <code key="value" className="text-emerald-400 bg-slate-800 px-2 py-1 rounded text-sm">
            "{node.value}"
          </code>
        );
        break;
        
      case 'Quantifier':
        properties.push(
          <code key="quant" className="text-purple-400 bg-slate-800 px-2 py-1 rounded text-sm font-bold">
            {node.quant}
          </code>
        );
        break;
        
      case 'CharClass':
        properties.push(
          <code key="chars" className="text-indigo-400 bg-slate-800 px-2 py-1 rounded text-sm">
            [{node.chars}]
          </code>
        );
        if (node.negated) {
          properties.push(
            <span key="negated" className="text-red-400 text-sm font-semibold">[NEGATED]</span>
          );
        }
        break;
        
      case 'Anchor':
        properties.push(
          <code key="kind" className="text-teal-400 bg-slate-800 px-2 py-1 rounded text-sm">
            {node.kind === 'start' ? '^' : '$'}
          </code>
        );
        break;
        
      case 'Group':
        properties.push(
          <span key="index" className="text-pink-400 bg-slate-800 px-2 py-1 rounded text-sm">
            Group #{node.index}
          </span>
        );
        break;
        
      case 'BackReference':
        properties.push(
          <span key="backref" className="text-rose-400 bg-slate-800 px-2 py-1 rounded text-sm">
            \\{node.index}
          </span>
        );
        break;
    }
    
    return properties;
  };

  // Calculate positioning for vertical tree
  const nodeWidth = 280; // Fixed width for each node
  const horizontalSpacing = 320; // Space between siblings
  const verticalSpacing = 120; // Space between levels

  return (
    <div className="relative inline-block">
      {/* Node content */}
      <div className="flex flex-col items-center">
        {/* Connection line from parent (vertical line down) */}
        {level > 0 && (
          <div className="w-px h-8 bg-slate-600 mb-2"></div>
        )}
        
        {/* The actual node */}
        <div 
          className="flex flex-col items-center space-y-2 py-3 px-4 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors group border border-slate-700 bg-slate-900 max-w-xs"
          onClick={toggleExpanded}
        >
          {/* Expand/collapse icon */}
          <div className="flex items-center justify-center mb-1">
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown size={16} className="text-slate-400" />
              ) : (
                <ChevronRight size={16} className="text-slate-400" />
              )
            ) : (
              <div className="w-4 h-4"></div>
            )}
          </div>
          
          {/* Node type badge */}
          <div className={`${config.color} text-white text-xs font-mono px-3 py-1 rounded flex items-center space-x-1`}>
            <span>{config.icon}</span>
            <span>{node.type}</span>
          </div>
          
          {/* Node details */}
          <div className="text-center">
            <div className="flex flex-col items-center space-y-1">
              <span className="text-slate-300 font-medium text-sm">{node.type}</span>
              <div className="flex flex-wrap justify-center gap-1">
                {getNodeProperties(node)}
              </div>
            </div>
            <div className="text-slate-500 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-center">
              {config.description}
            </div>
          </div>
          
          {/* Children count */}
          {hasChildren && (
            <span className="text-slate-500 text-xs bg-slate-700 px-2 py-1 rounded mt-1">
              {children.length} child{children.length !== 1 ? 'ren' : ''}
            </span>
          )}
        </div>

        {/* Children container */}
        {hasChildren && isExpanded && children.length > 0 && (
          <div className="relative pt-8">
            {/* Vertical line down to children area */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-8 bg-slate-600"></div>
            
            {/* Horizontal connector line for multiple children */}
            {children.length > 1 && (
              <div 
                className="absolute top-8 bg-slate-600 h-px"
                style={{
                  left: `calc(${horizontalSpacing / 2}px)`,
                  right: `calc(${horizontalSpacing / 2}px)`,
                }}
              ></div>
            )}
            
            {/* Vertical lines to each child */}
            <div className="flex" style={{ gap: `${horizontalSpacing}px` }}>
              {children.map((child: RegexAST, index: number) => (
                <div key={index} className="relative flex flex-col items-center">
                  {/* Vertical line up to horizontal connector */}
                  {children.length > 1 && (
                    <div className="w-px h-8 bg-slate-600"></div>
                  )}
                  
                  {/* Child node */}
                  <TreeNode 
                    node={child} 
                    level={level + 1} 
                    isLast={index === children.length - 1}
                    path={[...path, index]}
                    parentWidth={nodeWidth}
                    xOffset={index * horizontalSpacing}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Props for JsonView component
interface JsonViewProps {
  data: RegexAST;
  title: string;
}

// JSON View Component
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
          <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg inline-flex">
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