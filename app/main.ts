import { log } from "console";

const args = process.argv;
const pattern = args[3];

const inputLine: string = await Bun.stdin.text();

const DIGITS: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const ALPHA: string[] = [];

for (let i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++) {
  ALPHA.push(String.fromCharCode(i));
}
for (let i = "A".charCodeAt(0); i <= "Z".charCodeAt(0); i++) {
  ALPHA.push(String.fromCharCode(i));
}
ALPHA.push("_");
function tokenize(pattern: string): string[] {
  const tokens: string[] = [];
  let i = 0;

  while (i < pattern.length) {
    if (pattern[i] === "\\" && i + 1 < pattern.length) {
      tokens.push(pattern.slice(i, i + 2)); // \d or \w
      i += 2;
    } else if (pattern[i] === "[" && i + 1 < pattern.length) {
      let j = i + 1;
      while (j < pattern.length && pattern[j] !== "]") j++;
      if (j < pattern.length) {
        tokens.push(pattern.slice(i, j + 1)); // [abc] or [^abc]
        i = j + 1;
      } else {
        throw new Error("Unclosed [ in pattern");
      }
    } else {
      // collect literal characters until next \ or [
      let start = i;
      while (i < pattern.length && pattern[i] !== "\\" && pattern[i] !== "[") {
        i++;
      }
      tokens.push(pattern.slice(start, i)); // push literal like "apple"
    }
  }

  return tokens;
}

function matchToken(segment: string, token: string): boolean {
  if (token === "\\d") return segment.length === 1 && DIGITS.includes(segment);
  if (token === "\\w") return segment.length === 1 && (ALPHA.includes(segment) || DIGITS.includes(segment));
  if (token.startsWith("[^") && token.endsWith("]")) {
    const chars = token.slice(2, -1).split("");
    return segment.length === 1 && !chars.includes(segment);
  }
  if (token.startsWith("[") && token.endsWith("]")) {
    const chars = token.slice(1, -1).split("");
    return segment.length === 1 && chars.includes(segment);
  }
  return segment === token;
}


// ✅ Match entire pattern inside input
function matchPattern(input: string, pattern: string): boolean {
  const tokens = tokenize(pattern);

  for (let i = 0; i <= input.length; i++) {
    let matched = true;
    let pos = i;

    for (const token of tokens) {
      const len = (token.startsWith("\\") || token.startsWith("[")) ? 1 : token.length;
      const segment = input.slice(pos, pos + len);
      if (!matchToken(segment, token)) {
        matched = false;
        break;
      }
      pos += len;
    }

    if (matched) return true;
  }

  return false;
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
//aaaaaaaa