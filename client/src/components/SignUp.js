import React, { useState } from 'react';
import { signUpUser } from '../actions/auth';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const SignUp = ({ signUpUser, auth: { errors, isAuthenticated } }) => {
  const [formData, changeFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  });

  const { email, name, password, confirmPassword } = formData;

  const onFormChange = e => {
    changeFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onFormSubmit = e => {
    e.preventDefault();
    if (confirmPassword !== password) {
    } else {
      signUpUser(formData);
    }
  };

  if (isAuthenticated) {
    return <Redirect to='/documents' />;
  }

  return (
    <div className='container col-4 mt-4'>
      <form onSubmit={onFormSubmit}>
        <h2 className='text-center'>Sign Up</h2>
        <div className='form-group'>
          <label>Email address</label>
          <input
            type='email'
            className='form-control'
            name='email'
            placeholder='Enter email'
            value={email}
            onChange={onFormChange}
          />
          {errors.find(err => err.param === 'email') && (
            <small className='text-danger'>
              {errors.find(err => err.param === 'email').msg}
            </small>
          )}
        </div>
        <div className='form-group'>
          <label>Name</label>
          <input
            type='text'
            className='form-control'
            name='name'
            placeholder='Enter name'
            value={name}
            onChange={onFormChange}
          />
          {errors.find(err => err.param === 'name') && (
            <small className='text-danger'>
              {errors.find(err => err.param === 'name').msg}
            </small>
          )}
        </div>
        <div className='form-group'>
          <label>Password</label>
          <input
            type='password'
            className='form-control'
            name='password'
            placeholder='Password'
            value={password}
            onChange={onFormChange}
          />
          {errors.find(err => err.param === 'password') && (
            <small className='text-danger'>
              {errors.find(err => err.param === 'password').msg}
            </small>
          )}
        </div>
        <div className='form-group'>
          <label>Confirm Password</label>
          <input
            type='password'
            className='form-control'
            name='confirmPassword'
            placeholder='Password'
            value={confirmPassword}
            onChange={onFormChange}
          />
          {password !== confirmPassword && (
            <small className='text-danger'>Passwords do not match</small>
          )}
        </div>
        <button type='submit' className='btn btn-dark col-12'>
          Sign Up
        </button>
      </form>
    </div>
  );
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    signUpUser
  }
)(SignUp);
