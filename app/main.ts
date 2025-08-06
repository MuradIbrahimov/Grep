const args = process.argv;
const pattern = args[3];

const inputLine: string = await Bun.stdin.text();

const DIGITS: string[] = ["0","1","2","3","4","5","6","7","8","9"];
const ALPHA: string[] = [];

for (let i = "a".charCodeAt(0); i < "z".charCodeAt(0);i++){
  ALPHA.push(String.fromCharCode(i))
}
for (let i = "A".charCodeAt(0); i < "Z".charCodeAt(0);i++){
  ALPHA.push(String.fromCharCode(i))
}
ALPHA.push("_")
function matchPattern(inputLine: string, pattern: string): boolean {
  if (pattern.startsWith("[") && pattern.endsWith("]") ){
    const sequence: string[] = pattern.slice(1,-1).split("")

    for (const c of sequence){
      if(inputLine.includes(c)) return true
    }
    return false
  }

  if (pattern ===`\\d`) {
  for (const digit of DIGITS){
    if(inputLine.includes(digit)) return true
  }
   return false
 }
 if (pattern ===`\\w`){
for(const c of ALPHA){
  if (inputLine.includes(c)) return true
}
for(const digit of DIGITS){
   if (inputLine.includes(digit))
  return true
}
return false
 }

  if (pattern.length === 1) {
    return inputLine.includes(pattern);
  } else {
    throw new Error(`Unhandled pattern: ${pattern}`);
  }
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