// Deal alternatives within parentheses
export function parseAlternatives(tokens: string[]): string[][] {
    const alternatives: string[][] = [];
    let currentAlternative: string[] = [];
    
    let i = 0;
    
    // Find the opening parenthesis
    while (i < tokens.length && tokens[i] !== "(") {
      currentAlternative.push(tokens[i]);
      i++;
    }
    
    const beforeParens = [...currentAlternative];
    currentAlternative = [];
    i++; // Skip the "("
    
    // Parse alternatives inside parentheses
    while (i < tokens.length && tokens[i] !== ")") {
      if (tokens[i] === "|") {
        alternatives.push([...beforeParens, ...currentAlternative]);
        currentAlternative = [];
      } else {
        currentAlternative.push(tokens[i]);
      }
      i++;
    }
    
    // Add the last alternative
    if (currentAlternative.length > 0) {
      alternatives.push([...beforeParens, ...currentAlternative]);
    }
    
    i++; // Skip the ")"
    
    // Add tokens after parentheses to all alternatives
    const afterParens = tokens.slice(i);
    return alternatives.map(alt => [...alt, ...afterParens]);
  }