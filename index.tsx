// import ReactDOM from "react-dom";  // Updated import
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import "./index.css";
import { persistor, store } from "./redux/store";
import reportWebVitals from "./reportWebVitals";
import { createRoot } from "react-dom/client";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
   </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
