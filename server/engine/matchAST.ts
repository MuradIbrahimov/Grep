import type { RegexAST } from "./constants.js";
import { DIGITS, ALPHA } from "./constants.js";

let captureCounter = 0;

function assignGroupIndices(node: RegexAST): number {
  switch (node.type) {
    case "Group":
      node.index = ++captureCounter; // start at 1
      assignGroupIndices(node.child);
      break;
    case "Sequence":
      node.elements.forEach(assignGroupIndices);
      break;
    case "Alternative":
      node.options.forEach(assignGroupIndices);
      break;
    case "Quantifier":
      assignGroupIndices(node.child);
      break;
  }
  return captureCounter;
}



export function matchAST(
  input: string,
  ast: RegexAST,
  pos: number,
  hasAnchorEnd: boolean,
): boolean {
 const totalGroups = assignGroupIndices(ast);
const positions = match(ast, pos, new Array(totalGroups + 1).fill("")); 

function match(node: RegexAST, i: number, groups: string[]): [number, ...string[]][] {
  
  switch (node.type) {
    case "Sequence":
      let positions: [number, ...string[]][] = [[i, ...groups]];
      for (const el of node.elements) {
        const nextPositions: [number, ...string[]][] = [];
        for (const [p, ...g] of positions) {
          nextPositions.push(...match(el, p, g));
        }
        positions = nextPositions;
        if (positions.length === 0) break;
      }
      return positions;
      case "Alternative":
        return node.options.flatMap(opt => match(opt, i ,groups));
      case "Group": {
        const results = match(node.child, i, groups);
        return results.map(([p, ...g]) => {
          const newGroups = [...g];
          newGroups[node.index] = input.slice(i, p); 
          return [p, ...newGroups];
        });
}

      case "Quantifier":
        if (node.quant === "+") {
          let positions = match(node.child, i, groups);
          let allPositions = [...positions];
          while (positions.length > 0) {
           const next = positions.flatMap(([pIndex, ...g]) => match(node.child, pIndex, g));
            positions = next.filter(p => !allPositions.includes(p));
            allPositions.push(...positions);
          }
          return allPositions;
        } else if (node.quant === "?") {
          
            return [[i, ...groups], ...match(node.child, i, groups)];
        }
        return [];
    case "Literal":
  if (input.startsWith(node.value, i)) {
    return [[i + node.value.length, ...groups]];
  }
        return [];
      case "Digit":
        if (i < input.length && DIGITS.includes(input[i])) {
          return [[i + 1, ...groups]];
        }
        return [];
      case "Alpha":
        if (i < input.length && ALPHA.includes(input[i])) {
          return [[i + 1, ...groups]];
        }
        return [];
      case "Anchor":
        if (node.kind === "start") {
          return i === 0 ? [[i, ...groups]] : [];

        }
        if (node.kind === "end") {
        return i === input.length ? [[i, ...groups]] : [];
        }
        return [];
      case "Wildcard":
        if (i < input.length) {
            return [[i + 1, ...groups]];
        }
        return [];
      case "Word":
        if (i < input.length && ALPHA.includes(input[i] ) || DIGITS.includes(input[i]) ) {
            return [[i + 1, ...groups]];
        }
        return [];
      case "CharClass":
        if (i < input.length) {
            const match = node.negated
            ? !node.chars.includes(input[i])
            : node.chars.includes(input[i]);
            if (match) return [[i + 1, ...groups]];
        }
        return [];
      case "BackReference": {
        const ref = groups[node.index] || "";
        if (input.startsWith(ref, i)) {
          return [[i + ref.length, ...groups]];
        }
        return [];
      }

      default:
        return [];
    }
  }

 if (hasAnchorEnd) {
  return positions.some(([p]) => p === input.length);
}
return positions.length > 0;

}
export default matchAST;