import type { RegexAST } from "./constants.js";

const TOKEN_HANDLERS = {
  "^": () => ({ type: "Anchor", kind: "start" } as const),
  "$": () => ({ type: "Anchor", kind: "end" } as const),
  "\\d": () => ({ type: "Digit" } as const),
  "\\w": () => ({ type: "Word" } as const),
  "WILDCARD": () => ({ type: "Wildcard" } as const),
} as const;

// Character class for digits - pre-compiled for performance
const DIGIT_CHARS = new Set("0123456789");


export function parseAlternatives(tokens: string[], start = 0): [RegexAST, number] {
  const elements: RegexAST[] = [];
  let i = start;
  let groupIndex = 0;

  while (i < tokens.length) {
    const token = tokens[i];
    
    // Handle simple token mappings
    if (token in TOKEN_HANDLERS) {
      elements.push(TOKEN_HANDLERS[token as keyof typeof TOKEN_HANDLERS]());
      i++;
      continue;
    }

    // Handle complex tokens
    switch (token) {
      case "(":
        const [child, newIndex] = parseAlternatives(tokens, i + 1);
        elements.push({ type: "Group", child, index: groupIndex++ });
        i = newIndex;
        break;

      case "|":
        const [right, rightIndex] = parseAlternatives(tokens, i + 1);
        return [
          { type: "Alternative", options: [{ type: "Sequence", elements }, right] },
          rightIndex
        ];

      case ")":
        return [{ type: "Sequence", elements }, i + 1];

      default:
        i += handleComplexToken(token, elements);
        break;
    }
  }

  return [{ type: "Sequence", elements }, i];
}

function handleComplexToken(token: string, elements: RegexAST[]): number {
  // Handle quantifiers (+ and ?)
  if (isQuantifierToken(token)) {
    handleQuantifier(token, elements);
    return 1;
  }

  // Handle back references (\1, \2, etc.)
  if (isBackReference(token)) {
    const index = parseInt(token.slice(1), 10);
    elements.push({ type: "BackReference", index });
    return 1;
  }

  // Handle character classes [abc], [^abc]
  if (isCharacterClass(token)) {
    const negated = token[1] === "^";
    const chars = negated ? token.slice(2, -1) : token.slice(1, -1);
    elements.push({ type: "CharClass", chars, negated });
    return 1;
  }

  // Default: treat as literal
  elements.push({ type: "Literal", value: token });
  return 1;
}


function isQuantifierToken(token: string): boolean {
  return token.length > 0 && (token.endsWith("+") || token.endsWith("?"));
}


function handleQuantifier(token: string, elements: RegexAST[]): void {
  const quant = token[token.length - 1] as "+" | "?";
  const value = token.slice(0, -1);

  if (value) {
    // Quantifier applies to the literal value in the token
    elements.push({
      type: "Quantifier",
      quant,
      child: { type: "Literal", value }
    });
  } else if (elements.length > 0) {
    // Quantifier applies to the previous element
    const prev = elements.pop()!;
    elements.push({
      type: "Quantifier",
      quant,
      child: prev
    });
  }
}


function isBackReference(token: string): boolean {
  if (token.length <= 1 || token[0] !== "\\") return false;
  
  const numberPart = token.slice(1);
  return numberPart.length > 0 && numberPart.split("").every(ch => DIGIT_CHARS.has(ch));
}


function isCharacterClass(token: string): boolean {
  return token.length > 2 && token.startsWith("[") && token.endsWith("]");
}