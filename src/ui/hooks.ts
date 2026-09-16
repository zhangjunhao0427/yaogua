import { useEffect, useState, type DependencyList } from 'react';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => typeof matchMedia === 'function' && matchMedia(REDUCED_MOTION).matches);
  useEffect(() => {
    if (typeof matchMedia !== 'function') return;
    const query = matchMedia(REDUCED_MOTION);
    const onChange = () => setReduced(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/** 异步读取数据，读取完成前返回 undefined */
export function useLoad<T>(load: () => Promise<T>, deps: DependencyList): T | undefined {
  const [value, setValue] = useState<T>();
  useEffect(() => {
    let alive = true;
    void load().then((v) => {
      if (alive) setValue(() => v);
    });
    return () => {
      alive = false;
    };
    // load 每次渲染都是新函数，只按调用方给的 deps 重新读取
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return value;
}
