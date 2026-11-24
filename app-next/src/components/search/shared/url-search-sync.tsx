"use client";

import { WithSearch } from "@elastic/react-search-ui";
import { useEffect, useRef } from "react";

type SetSearchTermFn = (
  term: string,
  opts?: { shouldClearFilters?: boolean },
) => void;

function UrlSyncEffect({
  q,
  setSearchTerm,
}: {
  q: string;
  setSearchTerm: SetSearchTermFn;
}) {
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    setSearchTerm(q, { shouldClearFilters: false });
  }, [q, setSearchTerm]);
  return null;
}

/**
 * Syncs URL ?q= changes into the SearchProvider after initial mount.
 * Must be rendered inside a <SearchProvider>.
 * Uses shouldClearFilters: false to preserve filters like study_type.
 */
export function UrlSearchSync({ q }: { q: string }) {
  return (
    <WithSearch mapContextToProps={({ setSearchTerm }) => ({ setSearchTerm })}>
      {({ setSearchTerm }: { setSearchTerm?: SetSearchTermFn }) =>
        setSearchTerm ? (
          <UrlSyncEffect q={q} setSearchTerm={setSearchTerm} />
        ) : null
      }
    </WithSearch>
  );
}
