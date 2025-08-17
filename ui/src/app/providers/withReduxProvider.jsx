import {provider} from 'react-redux';
import store from '../store';

const withReduxProvider = (Component) => {
    return (props) => (
        <Provider store={store}>
            <Component {...props} />
        </Provider>
    );
};

export default