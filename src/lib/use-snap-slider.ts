import { MutableRefObject, useEffect, useRef, useState } from "react";
import { createSnapSlider, TSnapSliderStateFull } from "./snap-slider";

export interface TUseSnapSlider extends TSnapSliderStateFull {
  jumpTo: (index: number) => void;
  goNext: () => void;
  goPrev: () => void;
}

export function useSnapSlider(
  ref: MutableRefObject<HTMLDivElement | null>,
  count: number = 1,
  index: number = 0,
  circular = false,
  countHash?: string | number
): TUseSnapSlider {
  const [, forceUpdate] = useState<number>(0);
  const mountedRef = useRef<boolean>();
  const [observer] = useState(() =>
    createSnapSlider({
      element: ref.current,
      count,
      index,
      circular,
      initalSubscritionPublish: false,
    })
  );
  const result = observer.getState(count, index);
  useEffect(() => {
    if (mountedRef.current) {
      console.log("change count", count, countHash);
      observer.jumpTo(0);
      observer.calculate();
    }
  }, [count, countHash, observer]);
  useEffect(() => {
    mountedRef.current = true;
    const unsubscribe = observer.subscribe(() => {
      if (mountedRef.current) {
        forceUpdate((x) => x + 1);
      }
    });
    ref.current && observer.setElement(ref.current);
    return () => {
      mountedRef.current = false;
      unsubscribe();
    };
  }, [observer, forceUpdate]);
  return {
    ...result,
    jumpTo: observer.jumpTo,
    goNext: observer.goNext,
    goPrev: observer.goPrev,
  };
}
