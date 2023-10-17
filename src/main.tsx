import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.tsx";
import { Provider } from "react-redux";
import store from "./store.ts";
import { useSelector } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
