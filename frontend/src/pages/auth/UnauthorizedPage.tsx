import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  return (
    <div>
      <h1>403 - Unauthorized</h1>
      <p>Sorry, you do not have permission to access this page.</p>
      <Link to="/">Go to Homepage</Link>
      <br />
      <Link to="/login">Go to Login</Link>
    </div>
  );
};

export default UnauthorizedPage;
