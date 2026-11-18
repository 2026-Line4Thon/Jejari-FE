import { useEffect, useState } from 'react';

export default function useApiResource(load) {
  const [result, setResult] = useState(null);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    Promise.resolve().then(() => load(controller.signal)).then((data) => {
      if (active) setResult({ load, version, data, error: '' });
    }).catch((error) => {
      if (active) setResult({ load, version, data: null, error: error.message || '정보를 불러오지 못했어요.' });
    });
    return () => { active = false; controller.abort(); };
  }, [load, version]);
  const current = result?.load === load && result.version === version ? result : null;
  return { data: current?.data ?? null, error: current?.error ?? '', isLoading: !current, refresh: () => setVersion((value) => value + 1) };
}
