export type Predicate = ((...args: any) => boolean) | null;

export type DebounceCallback = (...args: any) => any;

const useDebounce = (waitTime = 1000, maxKeyStrokes = 20) => {
  let timerInterval: any = null;

  const debounceAction = (
    callback: DebounceCallback,
    actionPredicate: Predicate
  ) => {
    if (timerInterval) clearTimeout(timerInterval);
    if (actionPredicate && actionPredicate() === true) {
      timerInterval = setTimeout(() => {
        // eslint-disable-next-line no-console
        callback();
      }, waitTime);
    }
  };
  return debounceAction;
};

export default useDebounce;
