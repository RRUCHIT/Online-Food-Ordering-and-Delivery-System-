
  // import { createRoot } from "react-dom/client";
  // import App from "./app/App.jsx";
  // import "./styles/index.css";

  // const rootElement = document.getElementById("root");
  // if (rootElement) {
  //   createRoot(rootElement).render(<App />);
  // } else {
  //   console.error('Root element not found');
  // }
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App.jsx";

import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);