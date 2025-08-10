// patternMatcher.ts
import { tokenize } from './tokenizer.js';
import { matchToken } from './tokenMatcher.js';

/**
 * Recursively matches a sequence of tokens against input starting at a position
 */
function matchTokens(input: string, tokens: string[], startPos: number, hasAnchorEnd: boolean): boolean {
  let pos = startPos;

  for (let j = 0; j < tokens.length; j++) {
    const token = tokens[j];

    // Handle `+` operator with backtracking
    if (token.length === 2 && token[1] === '+') {
      const repeatChar = token[0];
      let maxConsume = 0;

      // Count how many repeatChar we can consume
      while (pos + maxConsume < input.length && input[pos + maxConsume] === repeatChar) {
        maxConsume++;
      }

      if (maxConsume < 1) {
        return false; // Must match at least one
      }

      // Try backtracking: start with maximum consumption, then reduce
      for (let consume = maxConsume; consume >= 1; consume--) {
        // Try matching the rest of the pattern with this consumption
        const remainingTokens = tokens.slice(j + 1);
        
        if (remainingTokens.length === 0) {
          // No more tokens to match, check if we should consume everything
          pos += consume;
          return !hasAnchorEnd || pos === input.length;
        }
        
        if (matchTokens(input, remainingTokens, pos + consume, hasAnchorEnd)) {
          return true;
        }
      }
      
      return false; // No valid consumption worked
    }

    // Handle `?` operator (zero or one)
    else if (token.length === 2 && token[1] === '?') {
      const optionalChar = token[0];
      const remainingTokens = tokens.slice(j + 1);
      
      // Try with the character (if it matches)
      if (pos < input.length && input[pos] === optionalChar) {
        if (remainingTokens.length === 0) {
          // No more tokens, check if we consumed exactly to the end (if anchored)
          return !hasAnchorEnd || pos + 1 === input.length;
        }
        
        if (matchTokens(input, remainingTokens, pos + 1, hasAnchorEnd)) {
          return true;
        }
      }
      
      // Try without the character (skip the optional char entirely)
      if (remainingTokens.length === 0) {
        // No more tokens, check if we're at the right position
        return !hasAnchorEnd || pos === input.length;
      }
      
      return matchTokens(input, remainingTokens, pos, hasAnchorEnd);
    }

    // Handle normal tokens
    else {
      const len = (token.startsWith("\\") || token.startsWith("[")) ? 1 : token.length;
      
      if (pos + len > input.length) {
        return false;
      }
      
      const segment = input.slice(pos, pos + len);

      if (!matchToken(segment, token)) {
        return false;
      }

      pos += len;
    }
  }

  // Check if we've consumed the entire string when anchored at end
  return !hasAnchorEnd || pos === input.length;
}

/**
 * Main pattern matching function
 * @param input The input string to match against
 * @param pattern The regex pattern to match
 * @returns true if pattern matches, false otherwise
 */
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

  const maxStart = hasAnchorStart ? 1 : input.length + 1;

  for (let i = 0; i < maxStart; i++) {
    if (hasAnchorStart && i !== 0) break;

    if (matchTokens(input, tokens, i, hasAnchorEnd)) {
      return true;
    }
  }

  return false;
}