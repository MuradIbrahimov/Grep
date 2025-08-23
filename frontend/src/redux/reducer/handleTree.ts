import type { RegexAST } from "../../../../server/engine/constants";

interface TreeNode {
    // Current active data
  pattern: string;
  tokens: string[] | null;
  ast: RegexAST | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
}
// Retrieve initial state from localStorage if available
const getInitialTree = () => {
  const storedTree = localStorage.getItem("tree");
  return storedTree ? JSON.parse(storedTree) : [];
};

const handleTree = (state: { nodes: TreeNode[] } = { nodes: getInitialTree() }, action: { type: string; payload: TreeNode }) => {
    switch (action.type) {
        case "SET_PATTERN":
            return {
                ...state,
                pattern: action.payload.pattern,
            };
         case "SET_TOKENS":
            return {
                ...state,
                tokens: action.payload.tokens,
            };
              case "SET_AST":
            return {
                ...state,
                ast: action.payload.ast,
            };
              case "SET_LOADING":
            return {
                ...state,
                isLoading: action.payload.isLoading,
            };
            case "SET_ERROR":
            return {
                ...state,
                error: action.payload.error,
            };
            case "CLEAR_ERROR":
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
}
export default handleTree