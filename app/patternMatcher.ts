import { tokenize } from './tokenizer.js';
import { parseAlternatives } from './parseAlternatives.js';
import type { RegexAST } from './constants.js';

// You will need to implement this function!
import { matchAST } from './matchAST.js';

export function matchPattern(input: string, pattern: string): boolean {
  const tokens = tokenize(pattern);
  console.log("Tokens:", tokens);
  
  // Parse pattern into AST
  const [ast] = parseAlternatives(tokens);
  console.dir(ast, { depth: null });
  // Anchors can be handled as AST nodes, or here:
  let hasAnchorStart = false;
  let hasAnchorEnd = false;

  // Option 1: If you want to keep anchors as AST nodes, handle them in parseAlternatives and matchAST.
  // Option 2: If not, handle them here:
  if (tokens[0] === "^") {
    hasAnchorStart = true;
  }
  if (tokens.at(-1) === "$") {
    hasAnchorEnd = true;
  }

  // Try matching at all possible positions (unless anchored)
  const maxStart = hasAnchorStart ? 1 : input.length + 1;
  for (let i = 0; i < maxStart; i++) {
    if (hasAnchorStart && i !== 0) break;
    if (matchAST(input, ast, i, hasAnchorEnd)) {
      return true;
    }
  }
  return false;
}