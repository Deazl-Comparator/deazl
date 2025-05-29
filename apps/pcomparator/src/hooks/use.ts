import { useEffect, useState } from "react";

type UseResponse<T> = [result: T | null, loading: boolean];

/**
 * It takes a promise and returns a tuple of the result and a boolean indicating
 * whether the promise is still loading
 * @param promise - (...v: any) => Promise<T>
 * @param {any} v - any - This is the parameters that you want to pass to the
 * promise.
 * @returns A function that returns a tuple of the result and a boolean indicating
 * if the promise is loading.
 */

// rome-ignore lint/suspicious/noExplicitAny: <explanation>
export default function use<T>(promise: (...v: any) => Promise<T>, ...v: any): UseResponse<T> {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<T | null>(null);

  useEffect(() => {
    setLoading(true);
    promise(...v).then((r) => {
      setResult(r);
      setLoading(false);
    });

    return () => setLoading(true);
  }, [...v]);

  return [result, loading];
}
