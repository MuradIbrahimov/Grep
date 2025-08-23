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

// Props for TreeNode component
interface TreeNodeProps {
  node: RegexAST;
  level?: number;
  path?: number[];
  parentWidth?: number;
  xOffset?: number;
}

// Tree Node Component - Now renders top to bottom
const TreeNode: React.FC<TreeNodeProps> = ({ 
  node, 
  level = 0, 
  path = [],
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

export default TreeNode;