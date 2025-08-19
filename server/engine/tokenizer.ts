import { ALPHA, DIGITS } from './constants.js';

export function tokenize(pattern: string): string[] {
  const tokens: string[] = [];
  let i = 0;

  let hasAnchorStart = pattern[0] === "^";
  let hasAnchorEnd = pattern[pattern.length - 1] === "$";

  if (hasAnchorStart) {
    tokens.push("^");
    pattern = pattern.slice(1);
  }
  if (hasAnchorEnd) {
    pattern = pattern.slice(0, -1);
  }

  while (i < pattern.length) {
    if (pattern[i] === "\\" && i + 1 < pattern.length) {
      tokens.push(pattern.slice(i, i + 2));
      i += 2;
      continue;
    }
    if (pattern[i] === "[" && i + 1 < pattern.length) {
      let j = i + 1;
      while (j < pattern.length && pattern[j] !== "]") j++;
      if (j < pattern.length) {
        tokens.push(pattern.slice(i, j + 1));
        i = j + 1;
        continue;
      } else {
        throw new Error("Unclosed [ in pattern");
      }
    }

    if (pattern[i] === ".") {
      tokens.push("WILDCARD");
      i++;
      continue;
    }
 
    if ((pattern[i] === "+" || pattern[i] === "?") && tokens.length > 0 && tokens[tokens.length - 1] === ")") {
      tokens.push(pattern[i]);
      i++;
      continue;
    }
    if ((pattern[i + 1] === "+" || pattern[i + 1] === "?") && pattern[i] !== ")" && pattern[i] !== ".") {
      tokens.push(pattern[i] + pattern[i + 1]);
      i += 2;
      continue;
    } 

if (ALPHA.includes(pattern[i]) || DIGITS.includes(pattern[i]) || pattern[i] === "_") {
  tokens.push(pattern[i]);
  i++;
  continue;
}

    tokens.push(pattern[i]);
    i++;
  }

  if (hasAnchorEnd) {
    tokens.push("$");
  }

  return tokens;
}