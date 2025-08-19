import { tokenize } from './tokenizer';
import { parseAlternatives } from './parseAlternatives';

import { matchAST } from './matchAST.js';

export function matchPattern(input: string, pattern: string): boolean {
  const tokens = tokenize(pattern);
  console.log("Tokens:", tokens);
  
  const [ast] = parseAlternatives(tokens);
 // console.dir(ast, { depth: null });
  let hasAnchorStart = false;
  let hasAnchorEnd = false;

  if (tokens[0] === "^") {
    hasAnchorStart = true;
  }
  if (tokens.at(-1) === "$") {
    hasAnchorEnd = true;
  }

  const maxStart = hasAnchorStart ? 1 : input.length + 1;
  for (let i = 0; i < maxStart; i++) {
    if (hasAnchorStart && i !== 0) break;
    if (matchAST(input, ast, i, hasAnchorEnd)) {
      return true;
    }
  }
  return false;
}