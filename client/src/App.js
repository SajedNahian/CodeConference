import React, { useEffect, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// Styling
import './App.css';

// Components
import Editor from './components/Editor';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import Navbar from './components/Navbar';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import PrivateRoute from './components/PrivateRoute';
import GuestRoute from './components/GuestRoute';
import Folders from './components/Folders';
import Folder from './components/Folder';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Switch>
            <GuestRoute exact path='/signup' component={SignUp} />
            <GuestRoute exact path='/signin' component={SignIn} />
            <PrivateRoute exact path='/editor' component={Editor} />
            <PrivateRoute exact path='/folders' component={Folders} />
            <PrivateRoute exact path='/folder/:folderId' component={Folder} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
