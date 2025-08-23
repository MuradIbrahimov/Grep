import { tokenize } from "../../../../server/engine/tokenizer";
import { parseAlternatives } from "../../../../server/engine/parseAlternatives";
import { matchPattern } from "../../shared/lib/utils/patternMatcher";
import type { DocumentState } from "../reducer/handleDocument";

export const addDocument = (document: DocumentState) => ({
    type: 'ADD_DOCUMENT',
    payload: document
});

// Convert thunk to simple action by processing the pattern here
export const updatePattern = (pattern: string) => {
  if (!pattern.trim()) {
    return {
      type: "UPDATE_PATTERN",
      payload: {
        pattern,
        tokens: null,
        ast: null,
        error: null
      }
    };
  }

  try {
    const tokens = tokenize(pattern);
    const [ast] = parseAlternatives(tokens);
    
    // Validate pattern once
    matchPattern("", tokens, ast);

    return {
      type: "UPDATE_PATTERN",
      payload: {
        pattern,
        tokens,
        ast,
        error: null
      }
    };
  } catch (err) {
    return {
      type: "UPDATE_PATTERN",
      payload: {
        pattern,
        tokens: null,
        ast: null,
        error: err instanceof Error ? err.message : "Invalid pattern"
      }
    };
  }
};