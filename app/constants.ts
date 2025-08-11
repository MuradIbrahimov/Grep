// constants.ts
export const DIGITS: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export const ALPHA: string[] = [];

// Build alphabet array
for (let i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++) {
  ALPHA.push(String.fromCharCode(i));
}
for (let i = "A".charCodeAt(0); i <= "Z".charCodeAt(0); i++) {
  ALPHA.push(String.fromCharCode(i));
}
ALPHA.push("_");

export type RegexAST =
  | { type: "Sequence", elements: RegexAST[] }
  | { type: "Alternative", options: RegexAST[] }
  | { type: "Group", child: RegexAST }
  | { type: "Quantifier", quant: string, child: RegexAST }
  | { type: "Literal", value: string }
  | { type: "Digit", }           // for \d
  | { type: "Alpha" }          // for [a-zA-Z_]
  | { type: "Anchor", kind: "start" | "end" };