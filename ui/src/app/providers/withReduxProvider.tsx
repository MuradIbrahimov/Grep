import {Provider} from 'react-redux';
import store from '../../redux/store';
import type { ComponentType } from 'react';

const withReduxProvider = <T extends object>(Component: ComponentType<T>) => {
    return (props: T) => (
        <Provider store={store}>
            <Component {...props} />
        </Provider>
    );
};

export default withReduxProvider;