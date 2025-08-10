// tokenMatcher.ts
import { ALPHA, DIGITS } from './constants.js';

export function matchToken(segment: string, token: string): boolean {
    // Dot matches any single character
    if (token === ".") {
        return segment.length === 1;
      }

    // Digit character class
  if (token === "\\d") {
    return segment.length === 1 && DIGITS.includes(segment);
  }

  // Word character class  
  if (token === "\\w") {
    return segment.length === 1 && (ALPHA.includes(segment) || DIGITS.includes(segment));
  }
  
  // Positive character groups [abc]
  if (token.startsWith("[") && token.endsWith("]") && !token.startsWith("[^")) {
    const chars = token.slice(1, -1).split("");
    return segment.length === 1 && chars.includes(segment);
  }
  
  // Negative character groups [^abc]
  if (token.startsWith("[^") && token.endsWith("]")) {
    const chars = token.slice(2, -1).split("");
    return segment.length === 1 && !chars.includes(segment);
  }
  
  console.log("segment '" + segment + "' token '" + token + "'");
  
  // Literal string matching
  return segment === token;
}