import type { RegexAST } from "./constants.js";
import { DIGITS, ALPHA } from "./constants.js";

export function matchAST(
  input: string,
  ast: RegexAST,
  pos: number,
  hasAnchorEnd: boolean
): boolean {
  // Helper for matching and returning new position
  function match(node: RegexAST, i: number): number[] {
    switch (node.type) {
      case "Sequence":
        let positions: number[] = [i];
        for (const el of node.elements) {
          const nextPositions: number[] = [];
          for (const p of positions) {
            nextPositions.push(...match(el, p));
          }
          positions = nextPositions;
          if (positions.length === 0) break;
        }
        return positions;
      case "Alternative":
        return node.options.flatMap(opt => match(opt, i));
      case "Group":
        return match(node.child, i);
      case "Quantifier":
        if (node.quant === "+") {
          // Must match at least once
          let positions = match(node.child, i);
          let allPositions = [...positions];
          while (positions.length > 0) {
            const next = positions.flatMap(p => match(node.child, p));
            positions = next.filter(p => !allPositions.includes(p));
            allPositions.push(...positions);
          }
          return allPositions;
        } else if (node.quant === "?") {
          // Zero or one
          return [i, ...match(node.child, i)];
        }
        return [];
      case "Literal":
        if (input.startsWith(node.value, i)) {
          return [i + node.value.length];
        }
        return [];
      case "Digit":
        if (i < input.length && DIGITS.includes(input[i])) {
          return [i + 1];
        }
        return [];
      case "Alpha":
        if (i < input.length && ALPHA.includes(input[i])) {
          return [i + 1];
        }
        return [];
      case "Anchor":
        if (node.kind === "start") {
          return i === 0 ? [i] : [];
        }
        if (node.kind === "end") {
          return i === input.length ? [i] : [];
        }
        return [];
      case "Wildcard":
        if (i < input.length) {
            return [i + 1];
        }
        return [];
      case "Word":
        if (i < input.length && ALPHA.includes(input[i] ) || DIGITS.includes(input[i]) ) {
            return [i + 1];
        }
        return [];
      case "CharClass":
        if (i < input.length) {
            const match = node.negated
            ? !node.chars.includes(input[i])
            : node.chars.includes(input[i]);
            if (match) return [i + 1];
        }
        return [];
      default:
        return [];
    }
  }

  const positions = match(ast, pos);
  if (hasAnchorEnd) {
    return positions.includes(input.length);
  }
  return positions.length > 0;
}

export default matchAST;