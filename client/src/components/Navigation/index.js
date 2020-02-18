import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
const Navigation = () => (
  <div>
    <ul>
      <li>
        <Link to={ROUTES.QUIZ}>QUIZ</Link>
      </li>
      <li>
        <Link to={ROUTES.SIGN_UP}>SIGN_UP</Link>
      </li>
      <li>
        <Link to={ROUTES.ABOUT}>ABOUT</Link>
      </li>
    </ul>
  </div>
);
export default Navigation;