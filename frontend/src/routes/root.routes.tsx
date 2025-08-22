import { Routes, Route } from "react-router-dom";

import {
  Home,
} from "../pages";
import Patterns from "../pages/Patterns";
import Visualizer from "../pages/Visualizer";

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/patterns" element={<Patterns />} />
      <Route path="/visualizer" element={<Visualizer />} />

    </Routes>
  );
};

export default Routing;
