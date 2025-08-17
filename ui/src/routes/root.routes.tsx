import React from "react";

import { Routes, Route } from "react-router-dom";

import {
  Home,
} from "../pages";

import "../styles/_globals.css";

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default Routing;
