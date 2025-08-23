import type { RegexAST } from "../../components/Visualizer/RegexASTVisualizer";
import type { DocumentState } from "../reducer/handleDocument";
export const addDocument = (document: DocumentState) => ({
    type: 'ADD_DOCUMENT',
    payload: document
});
export const setPattern = (pattern: string) => ({
    type: 'SET_PATTERN',
    payload: pattern
});
export const setToken = (token: string) => ({
    type: 'SET_TOKEN',
    payload: token
});
export const setAST = (ast: RegexAST) => ({
    type: 'SET_AST',
    payload: ast
});
export const setLoading = (isLoading: boolean) => ({
    type: 'SET_LOADING',
    payload: isLoading
});
export const setError = (error: string) => ({
    type: 'SET_ERROR',
    payload: error
});
export const clearError = () => ({
    type: 'CLEAR_ERROR'
});