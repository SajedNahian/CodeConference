import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { signOutUser } from '../actions/auth';
import { clearAuthErrors } from './../actions/auth';

const Navbar = ({
  auth: { isAuthenticated, loading },
  signOutUser,
  clearAuthErrors
}) => {
  const authLinks = (
    <ul className='navbar-nav ml-auto'>
      <li className='nav-item'>
        <Link className='nav-link' to='/folders'>
          Folders
        </Link>
      </li>
      <li className='nav-item'>
        <Link
          className='nav-link'
          to='#'
          onClick={() => {
            signOutUser();
          }}
        >
          Sign Out
        </Link>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul className='navbar-nav ml-auto'>
      <li className='nav-item'>
        <Link className='nav-link' to='/signup' onClick={clearAuthErrors}>
          Sign Up
        </Link>
      </li>
      <li className='nav-item'>
        <Link className='nav-link' to='/signin' onClick={clearAuthErrors}>
          Sign In
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className='navbar navbar-expand-md navbar-dark bg-dark'>
      <div className='container'>
        <div className='navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2'>
          <ul className='navbar-nav mr-auto'>
            <li className='nav-item active'>
              <Link className='navbar-brand mx-auto' to='/'>
                CodeConference
              </Link>
            </li>
          </ul>
        </div>
        <div className='navbar-collapse collapse w-100 order-3 dual-collapse2'>
          {!loading && (isAuthenticated ? authLinks : guestLinks)}
        </div>
      </div>
    </nav>
  );
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { signOutUser, clearAuthErrors }
)(Navbar);
