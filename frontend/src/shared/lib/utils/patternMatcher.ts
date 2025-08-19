
import { tokenize } from '../../../../../server/engine/tokenizer';
import { parseAlternatives } from '../../../../../server/engine/parseAlternatives';
import { matchAST } from '../../../../../server/engine/matchAST';

export function matchPattern(input: string, pattern: string): boolean {
  try {
    const tokens = tokenize(pattern);
    console.log("Tokens:", tokens);
    
    const [ast] = parseAlternatives(tokens);
    console.dir(ast, { depth: null });
    
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
  } catch (error) {
    throw new Error(`Pattern matching failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}