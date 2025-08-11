// tokenizer.ts
import { log } from 'node:console';
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
    pattern = pattern.slice(0, -1);
  }

  while (i < pattern.length) {
    // Escaped sequences
    if (pattern[i] === "\\" && i + 1 < pattern.length) {
      tokens.push(pattern.slice(i, i + 2));
      i += 2;
      continue;
    }

    // Character classes
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

    // Handle dot (.) as WILDCARD
    if (pattern[i] === ".") {
      tokens.push("WILDCARD");
      i++;
      continue;
    }

    // Handle quantifiers after )
    if ((pattern[i] === "+" || pattern[i] === "?") && tokens.length > 0 && tokens[tokens.length - 1] === ")") {
      tokens.push(pattern[i]);
      i++;
      continue;
    }

    // Handle quantifiers for single characters (e.g., s? or s+)
    if ((pattern[i + 1] === "+" || pattern[i + 1] === "?") && pattern[i] !== ")" && pattern[i] !== ".") {
      tokens.push(pattern[i] + pattern[i + 1]);
      i += 2;
      continue;
    }

// Handle single literal with quantifier (e.g., a+ or a?)
if (
  (ALPHA.includes(pattern[i]) || DIGITS.includes(pattern[i]) || pattern[i] === "_") &&
  (pattern[i + 1] === "+" || pattern[i + 1] === "?")
) {
  tokens.push(pattern[i] + pattern[i + 1]);
  i += 2;
  continue;
}

// Handle single literal
if (ALPHA.includes(pattern[i]) || DIGITS.includes(pattern[i]) || pattern[i] === "_") {
  tokens.push(pattern[i]);
  i++;
  continue;
}

    // Fallback for single char
    tokens.push(pattern[i]);
    i++;
  }

  if (hasAnchorEnd) {
    tokens.push("$");
  }

  return tokens;
}