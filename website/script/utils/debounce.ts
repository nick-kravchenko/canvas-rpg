// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function debounce(callback: Function, delay: number) {
  let timeout: NodeJS.Timeout;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(this, args), delay);
  };
}
