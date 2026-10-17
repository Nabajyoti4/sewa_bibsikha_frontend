import { useEffect, useEffectEvent, useState } from "react";

interface QueryState<T> {
  key: string;
  data?: T;
  error?: string;
}

/**
 * Runs `fetcher` whenever `key` changes. The previous data stays available while the next request loads,
 * and responses for stale keys are ignored.
 */
const useApiQuery = <T,>(key: string, fetcher: () => Promise<T>) => {
  const [state, setState] = useState<QueryState<T> | null>(null);
  const runFetcher = useEffectEvent(fetcher);

  useEffect(() => {
    let ignore = false;
    runFetcher()
      .then((data) => {
        if (!ignore) setState({ key, data });
      })
      .catch((error: unknown) => {
        if (!ignore) setState((previous) => ({ key, data: previous?.data, error: error instanceof Error ? error.message : "Something went wrong." }));
      });
    return () => {
      ignore = true;
    };
  }, [key]);

  return {
    data: state?.data,
    error: state?.key === key ? state.error : undefined,
    loading: state?.key !== key,
  };
};

export default useApiQuery;
