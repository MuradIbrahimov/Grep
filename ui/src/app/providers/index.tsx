import withRouter from "./withRouter";
import withReduxProvider from "./withReduxProvider";

import { compose } from "../../shared/lib/utils/common";

export const withProviders = (Component) => {
    return compose(
        withRouter,
        withReduxProvider
    )(Component);
};

export default withProviders