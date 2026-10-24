import { useEffect, useState } from 'react';

export function useApi(load, deps) {
  const [state, setState] = useState({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });
    load(controller.signal).then(
      (data) => setState({ status: 'done', data }),
      (error) => controller.signal.aborted || setState({ status: 'error', error }),
    );
    return () => controller.abort();
  }, deps);

  return state;
}
