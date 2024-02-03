import React from 'react';

import { Navigate } from 'react-router-dom';
import { AUTH_TOKEN } from '../constant/static';
import { LOGIN } from '../utils/routeConstants';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = localStorage.getItem(AUTH_TOKEN);

  if (!isLoggedIn) {
    return <Navigate to={LOGIN} />;
  }
  return children;
};

export default PrivateRoute;
