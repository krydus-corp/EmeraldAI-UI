import React from 'react';
import { Navigate } from 'react-router-dom';
import { AUTH_TOKEN } from '../constant/static';
import { PROJECT_LIST } from '../utils/routeConstants';

const PublicRoutes = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = localStorage.getItem(AUTH_TOKEN);

  if (isLoggedIn) {
    return <Navigate to={PROJECT_LIST} />;
  }
  return children;
};

export default PublicRoutes;
