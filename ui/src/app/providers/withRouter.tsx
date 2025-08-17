import { BrowserRouter } from "react-router-dom";
import type { ComponentType } from "react";

const withRouter = <T extends object>(Component: ComponentType<T>) => (props: T) => {
  return (
    <BrowserRouter>
        <Component {...props} />
    </BrowserRouter>
  );
};

export default withRouter;
