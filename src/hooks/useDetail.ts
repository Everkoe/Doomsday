import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATALOG_BY_ID } from '../data/catalog';

const PARAM = 'ver';

/** La ficha abierta vive en la URL (?ver=id): se puede compartir y "Atrás" la cierra. */
export function useDetail() {
  const [params, setParams] = useSearchParams();
  const openId = params.get(PARAM);
  const current = openId ? (CATALOG_BY_ID[openId] ?? null) : null;

  const open = useCallback(
    (id: string) => {
      // Si ya hay una ficha abierta, se reemplaza para que "Atrás" cierre en un solo paso.
      const isReplacing = new URLSearchParams(window.location.search).has(PARAM);
      setParams(
        (p) => {
          const next = new URLSearchParams(p);
          next.set(PARAM, id);
          return next;
        },
        { replace: isReplacing, preventScrollReset: true },
      );
    },
    [setParams],
  );

  const close = useCallback(() => {
    setParams(
      (p) => {
        const next = new URLSearchParams(p);
        next.delete(PARAM);
        return next;
      },
      { preventScrollReset: true },
    );
  }, [setParams]);

  return { current, open, close };
}
