import { ALPHA, DIGITS } from './constants.js';

export function matchToken(segment: string, token: string): boolean {
    if (token === ".") {
        return segment.length === 1;
      }

  if (token === "\\d") {
    return segment.length === 1 && DIGITS.includes(segment);
  }

  if (token === "\\w") {
    return segment.length === 1 && (ALPHA.includes(segment) || DIGITS.includes(segment));
  }
  
  if (token.startsWith("[") && token.endsWith("]") && !token.startsWith("[^")) {
    const chars = token.slice(1, -1).split("");
    return segment.length === 1 && chars.includes(segment);
  }
  
  if (token.startsWith("[^") && token.endsWith("]")) {
    const chars = token.slice(2, -1).split("");
    return segment.length === 1 && !chars.includes(segment);
  }
  
  console.log("segment '" + segment + "' token '" + token + "'");
  
  return segment === token;
}