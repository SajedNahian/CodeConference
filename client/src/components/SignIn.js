import React, { useState } from 'react';
import { connect } from 'react-redux';
import { signInUser } from '../actions/auth';

const SignIn = ({ signInUser, auth: { errors } }) => {
  const [formData, changeFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onFormInputChange = e => {
    changeFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onFormSubmit = e => {
    e.preventDefault();
    signInUser(formData);
  };

  return (
    <div class='container col-4 mt-4'>
      <form onSubmit={onFormSubmit}>
        <h2 class='text-center'>Sign In</h2>
        <div class='form-group'>
          <label for='exampleInputEmail1'>Email address</label>
          <input
            type='email'
            class='form-control'
            id='exampleInputEmail1'
            aria-describedby='emailHelp'
            name='email'
            value={email}
            placeholder='Enter email'
            onChange={onFormInputChange}
          />
          {errors.find(err => err.param === 'email') && (
            <small className='text-danger'>
              {errors.find(err => err.param === 'email').msg}
            </small>
          )}
        </div>
        <div class='form-group'>
          <label for='exampleInputPassword1'>Password</label>
          <input
            type='password'
            name='password'
            value={password}
            class='form-control'
            id='exampleInputPassword1'
            placeholder='Password'
            onChange={onFormInputChange}
          />
          {errors.find(err => err.param === 'password') && (
            <small className='text-danger'>
              {errors.find(err => err.param === 'password').msg}
            </small>
          )}
        </div>
        <button type='submit' class='btn btn-dark col-12'>
          Sign In
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
  { signInUser }
)(SignIn);
