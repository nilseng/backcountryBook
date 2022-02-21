import { debounce } from "lodash";
import { useEffect } from "react";

export const useScroll = (action: Function, windowHeight: number) => {
  useEffect(() => {
    window.addEventListener("scroll", () => onScrollAction(action, windowHeight));
    return () => window.removeEventListener("scroll", () => onScrollAction(action, windowHeight));
  }, [action, windowHeight]);
};

//TODO: Should not use debounce here, rather only fetch if there are no ongoing requests
const onScrollAction = debounce((action: Function, windowHeight: number) => {
  if (!document?.scrollingElement?.scrollHeight && document?.scrollingElement?.scrollHeight !== 0) return;
  if (
    windowHeight + document.documentElement.scrollTop >=
    document?.scrollingElement?.scrollHeight - windowHeight / 2
  ) {
    action();
  }
}, 250);
