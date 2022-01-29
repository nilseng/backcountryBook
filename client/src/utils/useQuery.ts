import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

export const useQuery = () => {
  return new URLSearchParams(useLocation()?.search);
};

export const useQueryParam = (key: string) => {
  const [state, setState] = useState<string | null>();

  const location = useLocation();

  const query = useMemo(() => new URLSearchParams(location?.search), [location?.search]);

  useEffect(() => {
    setState(query.get(key));

    return () => setState(undefined);
  }, [key, query]);

  return state;
};
