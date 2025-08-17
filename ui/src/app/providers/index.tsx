import withRouter from "./withRouter";
import withReduxProvider from "./withReduxProvider";
import { compose } from "../../shared/lib/utils/common";

export const withProviders = (Component: any) => {
    const Wrapped = (props: any) => <Component {...props} />;
    return compose(
        withRouter,
        withReduxProvider
    )(Wrapped);
};

export default withProviders;