import { log } from "console";

const args = process.argv;
const pattern = args[3];

const inputLine: string = (await Bun.stdin.text()).trim();

const DIGITS: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const ALPHA: string[] = [];

for (let i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++) {
  ALPHA.push(String.fromCharCode(i));
}
for (let i = "A".charCodeAt(0); i <= "Z".charCodeAt(0); i++) {
  ALPHA.push(String.fromCharCode(i));
}
ALPHA.push("_");

//  TOKENIZER FUNCTION

function tokenize(pattern: string): string[] {
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

function matchToken(segment: string, token: string): boolean {
  if (token === "\\d") return segment.length === 1 && DIGITS.includes(segment);
  if (token === "\\w") return segment.length === 1 && (ALPHA.includes(segment) || DIGITS.includes(segment));
  
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
  return segment === token;
}

// MATCH
function matchPattern(input: string, pattern: string): boolean {
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

if (args[2] !== "-E") {
  console.log("Expected first argument to be '-E'");
  process.exit(1);
}

console.error("Logs from your program will appear here!");

if (matchPattern(inputLine, pattern)) {
  process.exit(0);
} else {
  process.exit(1);
}