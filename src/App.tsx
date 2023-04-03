import React, { useState } from "react";
import { SnapSlider, SnapSliderItem, makeArray } from "./SnapSliderReact";
import classNames from "classnames";

interface TSnapSliderSlides {
  count: number;
  countHash?: string;
}

interface TSnapSliderExample {
  name: string;
  cssClass: string;
  circular: boolean;
  slides: TSnapSliderSlides[];
}

const examples: TSnapSliderExample[] = [
  {
    name: "Example 1",
    cssClass: "w-1/3",
    circular: true,
    slides: [
      {
        count: 8,
      },
      {
        count: 10,
      },
      {
        count: 7,
        countHash: "category-1",
      },
      {
        count: 7,
        countHash: "category-2",
      },
    ],
  },
  {
    name: "Example 2",
    cssClass: "w-full",
    circular: false,
    slides: [
      {
        count: 4,
      },
      {
        count: 2,
        countHash: "category-1",
      },
      {
        count: 2,
        countHash: "category-2",
      },
    ],
  },
];

function App() {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Snap-slider</h1>
      {examples.map((data, i) => (
        <Slider key={i} data={data} />
      ))}
    </div>
  );
}

const Slider: React.FC<{
  data: TSnapSliderExample;
}> = ({ data }) => {
  const { name, cssClass, slides, circular } = data;
  const [slideNum, setSlideNum] = useState<number>(0);
  const slide = slides[slideNum];
  const slideItems = makeArray(slide.count);
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl font-bold mb-2">{name}</h2>
        <select
          value={slideNum}
          onChange={(event) => {
            setSlideNum(Number(event.target.value));
          }}
        >
          {slides.map((number, i) => (
            <option key={i} value={i}>
              Slides {slides[i].count}
            </option>
          ))}
        </select>
      </div>
      <SnapSlider
        count={slideItems.length}
        circular={circular}
        countHash={slide.countHash}
        className="-mx-2"
      >
        {slideItems.map((slide, j) => (
          <SnapSliderItem className={classNames("px-2", cssClass)} key={j}>
            <div className="w-full aspect-square flex items-center justify-center bg-red-500 text-white">
              {slide + 1}
            </div>
          </SnapSliderItem>
        ))}
      </SnapSlider>
    </div>
  );
};

export default App;
