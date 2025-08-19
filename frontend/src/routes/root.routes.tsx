import { Routes, Route } from "react-router-dom";

import {
  Home,
} from "../pages";
import Patterns from "../pages/Patterns";

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/patterns" element={<Patterns />} />

    </Routes>
  );
};

export default Routing;
