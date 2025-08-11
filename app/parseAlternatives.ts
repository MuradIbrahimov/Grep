import type { RegexAST } from "./constants.js";

export function parseAlternatives(tokens: string[], start = 0): [RegexAST, number] {
    let elements: RegexAST[] = [];
    let i = start;

    while (i < tokens.length) {
        const token = tokens[i];
          if (token === "^") {
            elements.push({ type: "Anchor", kind: "start" });
            i++;
        } else if (token === "$") {
            elements.push({ type: "Anchor", kind: "end" });
            i++;
        }
        else if (token === "(") {
            const [child, newIndex] = parseAlternatives(tokens, i + 1);
            elements.push({ type: "Group", child });
            i = newIndex;
        } else if (token === "|") {
            // Split alternatives
            const [right, newIndex] = parseAlternatives(tokens, i + 1);
            return [
                { type: "Alternative", options: [ { type: "Sequence", elements }, right ] },
                newIndex
            ];
        } else if (token === ")") {
            return [ { type: "Sequence", elements }, i + 1 ];
        } else if (token.endsWith("+") || token.endsWith("?")) {
    const quant = token[token.length - 1];
    const value = token.slice(0, -1);

    // If value is not empty, treat as quantifier for a literal (e.g., "s?")
    if (value) {
        elements.push({
            type: "Quantifier",
            quant,
            child: { type: "Literal", value }
        });
    } else if (elements.length > 0) {
        // Quantifier applies to previous element (group, etc.)
        const prev = elements.pop()!;
        elements.push({
            type: "Quantifier",
            quant,
            child: prev
        });
    }
    i++;
}else if (token === "\\d") {
  elements.push({ type: "Digit" });
  i++;
}else if (token === "WILDCARD") {
  elements.push({ type: "Wildcard" });
  i++;
}else if (token === "\\w") {
  elements.push({ type: "Word" });
  i++;
}else if (token.startsWith("[") && token.endsWith("]")) {
  const negated = token[1] === "^";
  const chars = negated ? token.slice(2, -1) : token.slice(1, -1);
  elements.push({ type: "CharClass", chars, negated });
  i++;
}
         else {
            elements.push({ type: "Literal", value: token });
            i++;
        }
    }
    return [ { type: "Sequence", elements }, i ];
}