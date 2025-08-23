import { tokenize } from "../../../../server/engine/tokenizer";
import { parseAlternatives } from "../../../../server/engine/parseAlternatives";
import { matchPattern } from "../../shared/lib/utils/patternMatcher";
import type { DocumentState } from "../reducer/handleDocument";


export const addDocument = (document: DocumentState) => ({
    type: 'ADD_DOCUMENT',
    payload: document
});

export const updatePattern = (pattern: string) => (dispatch: any) => {
  dispatch({ type: "SET_PATTERN", payload: pattern });

  if (!pattern.trim()) {
    dispatch({ type: "SET_TOKEN", payload: null });
    dispatch({ type: "SET_AST", payload: null });
    dispatch({ type: "CLEAR_ERROR" });
    return;
  }

  try {
    const tokens = tokenize(pattern);
    const [ast] = parseAlternatives(tokens);

    // validate
    matchPattern("", tokens, ast);

    dispatch({ type: "SET_TOKEN", payload: tokens });
    dispatch({ type: "SET_AST", payload: ast });
    dispatch({ type: "CLEAR_ERROR" });
  } catch (err) {
    dispatch({ type: "SET_TOKEN", payload: null });
    dispatch({ type: "SET_AST", payload: null });
    dispatch({
      type: "SET_ERROR",
      payload: err instanceof Error ? err.message : "Invalid pattern",
    });
  }
};