import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth/index";
import { Link, Redirect } from "react-router-dom";
import { read, update, updateUser } from "./apiUser";

const Profile = props => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: false,
    success: false
  });

  const { name, email, password, error, success } = values;

  const init = userId => {
    // console.log(userId);
    read(userId, isAuthenticated().token).then(data => {
      if (data.error) {
        setValues({ ...values, error: true });
      } else {
        setValues({ ...values, name: data.name, email: data.email });
      }
    });
  };

  useEffect(() => {
    init(props.match.params.userId);
    console.log(isAuthenticated().user.id);
    console.log(isAuthenticated().token);
  }, []);

  const handleChange = event => {
    setValues({
      ...values,
      error: false,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = event => {
    event.preventDefault();
    // console.log(values);
    update(props.match.params.userId, isAuthenticated().token, {
      name,
      email,
      password
    }).then(data => {
      if (data.error) {
        alert(data.error);
      } else {
        updateUser(data, () => {
          // upate state
          setValues({
            ...values,
            name: data.name,
            email: data.email,
            success: true
          });
        });
      }
    });
  };

  const redirectUser = success => {
    if (success) {
      return <Redirect to='/cart' />;
    }
  };

  const profileUpdate = (name, email, password) => (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <label className='text-muted'>Name</label>
        <input
          type='text'
          onChange={handleChange}
          name='name'
          className='form-control'
          value={name}
        />

        <label className='text-muted'>Email</label>
        <input
          type='email'
          onChange={handleChange}
          name='email'
          className='form-control'
          value={email}
        />
        <label className='text-muted'>Password</label>
        <input
          type='password'
          onChange={handleChange}
          name='password'
          className='form-control'
          value={password}
        />
      </div>
      <button className='btn btn-primary'>Submit</button>
    </form>
  );

  return (
    <Layout
      title='Profile'
      description='Update your profile'
      className='container-fluid'
    >
      <h2 className='mb-4'>Profile Update</h2>
      {profileUpdate(name, email, password)}
      {redirectUser(success)}
    </Layout>
  );
};

export default Profile;
