import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthConsumer } from './context.jsx';

const ProtectedRoute = ({ component: Component}) => (
  <AuthConsumer>
    {({ isAuth }) => (

      <Route
    render={
      props =>
        isAuth
        ? <Component {...props} />
        : <Redirect to="/" />
    }

  />
    )}
  </AuthConsumer>
);
export default ProtectedRoute;
