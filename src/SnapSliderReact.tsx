import React, { useRef, useEffect } from "react";
import classnames from "classnames";

import { useSnapSlider } from "./lib/use-snap-slider";

export const makeArray = (count: number) => Array.from(Array(count).keys());

const Button: React.FC<{
  children: React.ReactNode;
  disabled: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    className="h-8 w-8 flex items-center justify-center rounded-full bg-black text-white disabled:opacity-50 aspect-square"
    disabled={disabled}
  >
    {children}
  </button>
);

export const SnapSlider: React.FC<{
  children: React.ReactNode;
  count: number;
  index?: number;
  className?: string;
  sliderClassName?: string;
  onChangeIndex?: (index: number) => void;
  countHash?: string;
  debug?: boolean;
  circular?: boolean;
}> = ({
  children,
  count: _count,
  index: _index,
  className,
  sliderClassName,
  onChangeIndex,
  countHash,
  circular,
  debug,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const {
    goNext,
    goPrev,
    index,
    indexDelta,
    prevEnabled,
    nextEnabled,
    jumpTo,
    count,
    countDelta,
  } = useSnapSlider(ref, _count, _index, circular, countHash);
  const refInputIndex = useRef(_index);
  const refIndex = useRef(index);
  useEffect(() => {
    if (index !== undefined && _index !== index && onChangeIndex) {
      const inputIndexChange = _index !== refInputIndex.current;
      const indexChange = index !== refIndex.current;

      if (indexChange) {
        onChangeIndex(index);
      }
      if (!indexChange && inputIndexChange) {
        jumpTo(index);
      }
    }
    refInputIndex.current = _index;
    refIndex.current = index;
  }, [index, _index, jumpTo, onChangeIndex]);
  const pages = makeArray(count);
  debug && console.log("render", { index, indexDelta, count, countDelta });
  return (
    <div className={classnames("grid grid-cols-1 gap-5", className)}>
      <div className="flex items-center gap-2">
        <Button onClick={goPrev} disabled={!prevEnabled} aria-label="Next">
          <svg className="h-[1em] w-[1em]" aria-hidden="true" role="img">
            <use xlinkHref="#arrow-prev"></use>
          </svg>
        </Button>
        <div
          className={classnames(
            "flex-1 flex scroll-smooth snap-x snap-mandatory overflow-x-auto w-full",
            sliderClassName
          )}
          ref={ref}
        >
          {children}
        </div>
        <Button onClick={goNext} disabled={!nextEnabled} aria-label="Next">
          <svg className="h-[1em] w-[1em]" aria-hidden="true" role="img">
            <use xlinkHref="#arrow-next"></use>
          </svg>
        </Button>
      </div>
      <nav
        aria-label="Pages"
        className="flex justify-center items-center gap-2"
      >
        {pages.map((page) => (
          <button
            key={page}
            className={classnames(
              "h-4 w-4 border-2 border-black rounded-full",
              { "bg-black": index === page }
            )}
            onClick={() => jumpTo(page)}
          />
        ))}
      </nav>
    </div>
  );
};

export const SnapSliderItem: React.FC<{
  children?: React.ReactNode;
  className: string;
}> = ({ children, className }) => (
  <div className={classnames("flex snap-start shrink-0", className)}>
    {children}
  </div>
);

export default SnapSlider;
