export const log = {
  isDebug: false,
  debug: (...args: any[]) => {
    if (log.isDebug) {
      console.log(...args);
    }
  },
  info: (...args: any[]) => {
    console.log(...args);
  },
  error: (...args: any[]) => {
    console.log(...args);
  },
};
