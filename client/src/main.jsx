import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Home from "./Home";
import MintNFT from "./MintNFT";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Profile from "./Profile.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />}></Route>
      <Route path="/mint" element={<MintNFT />}></Route>
      <Route path="/user" element={<Profile />}></Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
