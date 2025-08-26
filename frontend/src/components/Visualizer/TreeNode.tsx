import React, { useState, type JSX } from 'react';
import { ChevronDown, ChevronRight} from 'lucide-react';
import type { RegexAST } from '../../../../server/engine/constants';

// Node configuration interface
export interface NodeConfig {
  color: string;
  icon: string;
  description: string;
}

// Updated node configurations for your AST structure
export const nodeConfig: Record<string, NodeConfig> = {
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
  path?: number[];
}

const TreeNode: React.FC<TreeNodeProps> = ({ 
  node, 
  level = 0, 
  path = [],
}) => {
  // Early return if node is invalid
  if (!node || !node.type) {
    return (
      <div className="bg-red-900 text-red-200 p-2 rounded text-xs">
        Invalid node
      </div>
    );
  }

  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const config = nodeConfig[node.type] || { 
    color: 'bg-gray-500', 
    icon: '?', 
    description: 'Unknown type' 
  };
  
  const getChildren = (node: RegexAST): RegexAST[] => {
    if (!node) return [];
    
    switch (node.type) {
      case 'Sequence':
        return Array.isArray(node.elements) ? node.elements.filter(Boolean) : [];
      case 'Alternative':
        return Array.isArray(node.options) ? node.options.filter(Boolean) : [];
      case 'Quantifier':
        return node.child ? [node.child] : [];
      case 'Group':
        return node.child ? [node.child] : [];
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

  const getNodeProperties = (node: RegexAST): JSX.Element[] => {
    const properties: JSX.Element[] = [];
    
    if (!node) return properties;
    
    switch (node.type) {
      case 'Literal':
        if (node.value !== undefined) {
          properties.push(
            <code key="value" className="text-emerald-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">
              "{node.value}"
            </code>
          );
        }
        break;
        
      case 'Quantifier':
        if (node.quant !== undefined) {
          properties.push(
            <code key="quant" className="text-purple-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs font-bold">
              {node.quant}
            </code>
          );
        }
        break;
        
      case 'CharClass':
        if (node.chars !== undefined) {
          properties.push(
            <code key="chars" className="text-indigo-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">
              [{node.chars}]
            </code>
          );
        }
        if (node.negated) {
          properties.push(
            <span key="negated" className="text-red-400 text-xs font-semibold">[NEG]</span>
          );
        }
        break;
        
      case 'Anchor':
        if (node.kind !== undefined) {
          properties.push(
            <code key="kind" className="text-teal-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">
              {node.kind === 'start' ? '^' : '$'}
            </code>
          );
        }
        break;
        
      case 'Group':
        if (node.index !== undefined) {
          properties.push(
            <span key="index" className="text-pink-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">
              #{node.index}
            </span>
          );
        }
        break;
        
      case 'BackReference':
        if (node.index !== undefined) {
          properties.push(
            <span key="backref" className="text-rose-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">
              \\{node.index}
            </span>
          );
        }
        break;
    }
    
    return properties;
  };

  // Determine if we should use horizontal layout for children
  const shouldUseHorizontalLayout = (children: RegexAST[], currentLevel: number) => {
    // Use horizontal for sequences at shallow levels, and when children are mostly leaf nodes
    if (node.type === 'Sequence' && currentLevel <= 2) return true;
    if (node.type === 'Alternative' && currentLevel <= 1) return true;
    
    // Check if most children are leaf nodes (no children of their own)
    const leafChildren = children.filter(child => getChildren(child).length === 0);
    return leafChildren.length >= children.length * 0.7; // 70% are leaves
  };

  const useHorizontalLayout = hasChildren && shouldUseHorizontalLayout(children, level);

  return (
    <div className="relative">
      {/* Connection line from parent */}
      {level > 0 && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-px h-4 bg-slate-600"></div>
      )}
      
      {/* The actual node */}
      <div 
        className="flex flex-col items-center space-y-1 py-2 px-3 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors group border border-slate-700 bg-slate-900 min-w-0 max-w-48"
        onClick={toggleExpanded}
      >
        {/* Header with expand/collapse and type */}
        <div className="flex items-center space-x-2 min-w-0">
          {hasChildren && (
            isExpanded ? (
              <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
            ) : (
              <ChevronRight size={14} className="text-slate-400 flex-shrink-0" />
            )
          )}
          
          {/* Node type badge - more compact */}
          <div className={`${config.color} text-white text-xs font-mono px-2 py-0.5 rounded flex items-center space-x-1 flex-shrink-0`}>
            <span className="text-xs">{config.icon}</span>
            <span className="truncate">{node.type}</span>
          </div>
        </div>
        
        {/* Node properties */}
        {getNodeProperties(node).length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 min-w-0">
            {getNodeProperties(node)}
          </div>
        )}
        
        {/* Children count for collapsed nodes */}
        {hasChildren && !isExpanded && (
          <span className="text-slate-500 text-xs bg-slate-700 px-1.5 py-0.5 rounded">
            {children.length}
          </span>
        )}
        
        {/* Description on hover */}
        <div className="text-slate-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity text-center absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-800 px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
          {config.description}
        </div>
      </div>

      {/* Children container */}
      {hasChildren && isExpanded && children.length > 0 && (
        <div className="relative mt-4">
          {useHorizontalLayout ? (
            // Horizontal layout for sequences and alternatives
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {children.map((child: RegexAST, index: number) => {
                // Skip invalid children
                if (!child || !child.type) return null;
                
                return (
                  <div key={index} className="relative">
                    {/* Connection line to child */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-px h-4 bg-slate-600"></div>
                    <TreeNode 
                      node={child} 
                      level={level + 1} 
                      path={[...path, index]}
                    />
                  </div>
                );
              }).filter(Boolean)}
            </div>
          ) : (
            // Vertical layout for deep nesting
            <div className="space-y-4 ml-6 border-l border-slate-600 pl-4">
              {children.map((child: RegexAST, index: number) => {
                // Skip invalid children
                if (!child || !child.type) return null;
                
                return (
                  <div key={index} className="relative">
                    {/* Horizontal connector to child */}
                    <div className="absolute -left-4 top-6 w-4 h-px bg-slate-600"></div>
                    <TreeNode 
                      node={child} 
                      level={level + 1} 
                      path={[...path, index]}
                    />
                  </div>
                );
              }).filter(Boolean)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Main wrapper component with scroll optimization
const RegexTreeViewer: React.FC<{ ast: RegexAST }> = ({ ast }) => {
  return (
    <div className="w-full h-full overflow-auto bg-slate-950 p-8">
      <div className="flex justify-center min-w-fit">
        <TreeNode node={ast} />
      </div>
    </div>
  );
};

export default TreeNode;
