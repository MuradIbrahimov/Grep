import React, { useState, useEffect, type JSX } from 'react';
import { ChevronDown, ChevronRight, Code, Eye, Copy } from 'lucide-react';
import type { RegexAST } from '../../../../server/engine/constants';

interface NodeConfig {
  color: string;
  icon: string;
  description: string;
}

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

interface TreeNodeProps {
  node: RegexAST;
  level?: number;
  isLast?: boolean;
  path?: number[];
}

// Tree Node Component
const TreeNode: React.FC<TreeNodeProps> = ({ 
  node, 
  level = 0, 
  isLast = true, 
  path = [] 
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

  return (
    <div className="relative">
      {/* Connection lines */}
      {level > 0 && (
        <>
          <div className="absolute left-6 top-0 w-px h-6 bg-slate-600"></div>
          <div className="absolute left-6 top-6 w-4 h-px bg-slate-600"></div>
          {!isLast && <div className="absolute left-6 top-6 w-px h-full bg-slate-600"></div>}
        </>
      )}
      
      {/* Node content */}
      <div 
        className={`flex items-center space-x-3 py-2 px-3 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors group`}
        onClick={toggleExpanded}
        style={{ marginLeft: `${level * 2}rem` }}
      >
        {/* Expand/collapse icon */}
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
          ) : (
            <ChevronRight size={16} className="text-slate-400 flex-shrink-0" />
          )
        ) : (
          <div className="w-4 h-4 flex-shrink-0"></div>
        )}
        
        {/* Node type badge */}
        <div className={`${config.color} text-white text-xs font-mono px-2 py-1 rounded flex items-center space-x-1 flex-shrink-0`}>
          <span>{config.icon}</span>
          <span>{node.type}</span>
        </div>
        
        {/* Node details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-slate-300 font-medium">{node.type}</span>
            {getNodeProperties(node)}
          </div>
          <div className="text-slate-500 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {config.description}
          </div>
        </div>
        
        {/* Children count */}
        {hasChildren && (
          <span className="text-slate-500 text-xs bg-slate-700 px-2 py-1 rounded">
            {children.length} child{children.length !== 1 ? 'ren' : ''}
          </span>
        )}
      </div>
      
      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="ml-4">
          {children.map((child: RegexAST, index: number) => (
            <TreeNode 
              key={index} 
              node={child} 
              level={level + 1} 
              isLast={index === children.length - 1}
              path={[...path, index]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;