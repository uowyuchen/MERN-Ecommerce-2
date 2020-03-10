import React, { useState } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth/index";
import { createCategory } from "./apiAdmin";
import { Link } from "react-router-dom";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  // destructure user and token from localstorage
  const { user, token } = isAuthenticated();

  // handle form change
  const handleChange = event => {
    setError("");
    setName(event.target.value);
  };

  // handle submit form
  const handleSubmit = event => {
    event.preventDefault();
    setError("");
    setSuccess(false);
    // make request to api to create category
    // 要传给后台object，所以{ name }
    createCategory(user.id, token, { name }).then(data => {
      if (data.error) {
        console.log(data.error);
        setError(data.error);
      } else {
        setError("");
        setSuccess(true);
      }
    });
  };

  // show success
  const showSuccess = () => {
    if (success) {
      return <h3 className='text-success'>{name} is created</h3>;
    }
  };

  // show error
  const showError = () => {
    if (error) {
      return <h3 className='text-danger'>Category should be unique</h3>;
    }
  };

  // go back to dashboard
  const goBack = () => (
    <div className='mt-5'>
      <Link to='/admin/dashboard' className='text-warning'>
        Back to Dashboard
      </Link>
    </div>
  );

  const newCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <label className='text-muted'>Name</label>
        <input
          className='form-control'
          type='text'
          name='name'
          value={name}
          onChange={handleChange}
          autoFocus
          required
        />
      </div>
      <button className='btn btn-outline-primary'>Create Cateory</button>
    </form>
  );

  return (
    <Layout
      title='Add a new category'
      description={`G'day ${name}, ready to add a new category`}
    >
      <div className='row'>
        <div className='col-md-8 offset-md-2'>
          {showSuccess()}
          {showError()}
          {newCategoryForm()}
          {goBack()}
        </div>
      </div>
    </Layout>
  );
};

export default AddCategory;
