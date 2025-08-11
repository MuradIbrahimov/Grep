export function parseAlternatives(tokens: string[], start = 0): [string[][], number] {
    let alternatives: string[][] = [];
    let currentAlternative: string[] = [];
    let i = start;

    while (i < tokens.length) {
        if (tokens[i] === "(") {
            // Parse nested group
            const [nestedAlts, newIndex] = parseAlternatives(tokens, i + 1);
            if (nestedAlts.length === 0) {
                // Empty group
                currentAlternative = [...currentAlternative];
            } else {
                // For each alternative so far, combine with each nested alternative
                const combined: string[][] = [];
                for (const alt of nestedAlts) {
                    combined.push([...currentAlternative, ...alt]);
                }
                currentAlternative = [];
                // If there are already alternatives, cross product them
                if (alternatives.length > 0) {
                    const newAlternatives: string[][] = [];
                    for (const prevAlt of alternatives) {
                        for (const combo of combined) {
                            newAlternatives.push([...prevAlt, ...combo]);
                        }
                    }
                    alternatives = newAlternatives;
                } else {
                    alternatives = [...combined];
                }
            }
            i = newIndex;
        } else if (tokens[i] === "|") {
            if (currentAlternative.length > 0) {
                alternatives.push([...currentAlternative]);
            } else if (alternatives.length === 0) {
                alternatives.push([]);
            }
            currentAlternative = [];
            i++;
        } else if (tokens[i] === ")") {
            i++; // Move past ')'
            break;
        } else {
            currentAlternative.push(tokens[i]);
            i++;
        }
    }
    if (currentAlternative.length > 0) {
        alternatives.push([...currentAlternative]);
    }
    return [alternatives, i];
}