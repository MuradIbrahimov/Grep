export function compose<T>(fn1: (arg: T) => T, ...fns: Array<(arg: T) => T>): (arg: T) => T {
  return fns.reduce((prevFn, nextFn) => (value: T) => prevFn(nextFn(value)), fn1);
}