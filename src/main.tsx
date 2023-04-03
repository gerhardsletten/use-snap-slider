import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);

/*
<React.StrictMode>
import { createSnapSliderVanilla } from "./snap-slider-vanlila";
document.querySelectorAll<HTMLElement>("[data-slider]").forEach((element) => {
  createSnapSliderVanilla(element);
});
*/
