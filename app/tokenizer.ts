// tokenizer.ts
import { ALPHA, DIGITS } from './constants.js';

export function tokenize(pattern: string): string[] {
  const tokens: string[] = [];
  let i = 0;

  // Anchors
  let hasAnchorStart = pattern[0] === "^";
  let hasAnchorEnd = pattern[pattern.length - 1] === "$";

  if (hasAnchorStart) {
    tokens.push("^");
    pattern = pattern.slice(1);
  }

  if (hasAnchorEnd) {
    pattern = pattern.slice(0, -1); // Remove $ from end for processing
  }

  while (i < pattern.length) {
    // Escaped sequences
    if (pattern[i] === "\\" && i + 1 < pattern.length) {
      tokens.push(pattern.slice(i, i + 2));
      i += 2;
      continue;
    }

    // Character classes like [abc] or [^abc]
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

    // Check if next is '+' → create repeat token
    if (i + 1 < pattern.length && pattern[i + 1] === "+") {
      tokens.push(pattern[i] + "+");
      i += 2;
      continue;
    }

    // Group non-special literal characters
    let start = i;
    while (
      i < pattern.length &&
      (ALPHA.includes(pattern[i]) || DIGITS.includes(pattern[i])) &&
      pattern[i] !== "\\" &&
      pattern[i] !== "[" &&
      (i + 1 >= pattern.length || pattern[i + 1] !== "+")
    ) {
      i++;
    }

    if (start < i) {
      tokens.push(pattern.slice(start, i));
      continue;
    }

    // Fallback for single char
    tokens.push(pattern[i]);
    i++;
  }

  // Add trailing $ if present
  if (hasAnchorEnd) {
    tokens.push("$");
  }

  return tokens;
}