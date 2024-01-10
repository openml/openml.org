import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

export const useNextRouting = (config, basePathUrl) => {
  const router = useRouter();
  const { asPath } = router;

  const getSearchParamsFromUrl = useCallback((url) => {
    return url.match(/\?(.+)/)?.[1] || "";
  }, []);

  const readUrl = useCallback(() => {
    return getSearchParamsFromUrl(asPath);
  }, [asPath, getSearchParamsFromUrl]);

  const writeUrl = useCallback(
    (url, { replaceUrl }) => {
      const method = router[replaceUrl ? "replace" : "push"];
      const params = Object.fromEntries(new URLSearchParams(url).entries());
      method({ query: { ...router.query, ...params } }, undefined, {
        shallow: true,
      });
    },
    [router],
  );

  const routeChangeHandler = useCallback(
    (callback) => {
      const handler = (fullUrl) => {
        if (fullUrl.includes(basePathUrl)) {
          callback(getSearchParamsFromUrl(fullUrl));
        }
      };
      router.events.on("routeChangeComplete", handler);
      return () => {
        router.events.off("routeChangeComplete", handler);
      };
    },
    [basePathUrl, router, getSearchParamsFromUrl],
  );

  const routingOptions = useMemo(() => {
    return {
      readUrl,
      writeUrl,
      routeChangeHandler,
    };
  }, [readUrl, writeUrl, routeChangeHandler]);

  return useMemo(() => {
    return {
      ...config,
      routingOptions,
    };
  }, [config, routingOptions]);
};
