// patternMatcher.ts
import { tokenize } from './tokenizer.js';
import { matchTokens } from './matchTokens.js';
import { parseAlternatives } from './parseAlternatives.js';

export function matchPattern(input: string, pattern: string): boolean {
  const tokens = tokenize(pattern);
  console.log("tokens", tokens);

  let hasAnchorStart = false;
  let hasAnchorEnd = false;

  if (tokens[0] === "^") {
    hasAnchorStart = true;
    tokens.shift();
  }

  if (tokens.at(-1) === "$") {
    hasAnchorEnd = true;
    tokens.pop();
  }

  // NEW: Check for OR alternatives
  if (tokens.includes("(") && tokens.includes("|")) {
    const alternatives = parseAlternatives(tokens);
    console.log("alternatives:", alternatives);
    
    // Test each alternative
    for (const alternative of alternatives) {
      const maxStart = hasAnchorStart ? 1 : input.length + 1;
      
      for (let i = 0; i < maxStart; i++) {
        if (hasAnchorStart && i !== 0) break;
        
        if (matchTokens(input, alternative, i, hasAnchorEnd)) {
          return true;
        }
      }
    }
    return false;
  }

  // EXISTING: Normal matching logic
  const maxStart = hasAnchorStart ? 1 : input.length + 1;

  for (let i = 0; i < maxStart; i++) {
    if (hasAnchorStart && i !== 0) break;

    if (matchTokens(input, tokens, i, hasAnchorEnd)) {
      return true;
    }
  }

  return false;
}
