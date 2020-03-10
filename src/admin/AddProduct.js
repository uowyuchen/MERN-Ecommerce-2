import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth/index";
import { createProduct, getAllCategories } from "./apiAdmin";
import { Link } from "react-router-dom";

const AddProduct = () => {
  const { user, token } = isAuthenticated();
  // set state
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    categories: [],
    category: "",
    shipping: "",
    quantity: "",
    photo: "",
    loading: false,
    error: "",
    createdProduct: "",
    redirectToProfile: false,
    formData: ""
  });

  const {
    name,
    description,
    price,
    categories,
    category,
    shipping,
    quantity,
    loading,
    error,
    createdProduct,
    redirectToProfile,
    formData
  } = values;

  // get all categories & set formData
  const initAllCategories = () => {
    getAllCategories().then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, categories: data, formData: new FormData() });
      }
    });
  };

  // componentDidMount
  useEffect(() => {
    initAllCategories();
  }, []);

  // handle form change
  const handleChange = event => {
    const value =
      event.target.name === "photo"
        ? event.target.files[0]
        : event.target.value;

    // set formData
    formData.set(event.target.name, value);
    setValues({ ...values, [event.target.name]: value });
  };

  // handle form submit
  const handleSubmit = event => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });
    // call api
    createProduct(user.id, token, formData).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          name: "",
          description: "",
          price: "",
          quantity: "",
          photo: "",
          loading: false,
          error: "",
          createdProduct: data.name
        });
      }
    });
  };

  // show error
  const showError = () => (
    <div
      className='alert alert-danger'
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );
  // show success
  const showSuccess = () => (
    <div
      className='alert alert-info'
      style={{ display: createdProduct ? "" : "none" }}
    >
      <h2>{`${createdProduct} is created!`}</h2>
    </div>
  );

  // show loading
  const showLoading = () =>
    loading && (
      <div className='alert alert-success'>
        <h2>Loading...</h2>
      </div>
    );

  // create a product form
  const newProductForm = () => (
    <form onSubmit={handleSubmit}>
      {/* product photo */}
      <h4>Post Photo</h4>
      <div className='form-group'>
        <label className='btn btn-secondary'>
          <input
            type='file'
            name='photo'
            accept='image/*'
            onChange={handleChange}
          />
        </label>
      </div>
      {/* product name */}
      <div className='form-group'>
        <label htmlFor='name' className='text-muted'>
          Name
        </label>
        <input
          type='text'
          className='form-control'
          name='name'
          value={name}
          onChange={handleChange}
        />
      </div>
      {/* product description */}
      <div className='form-group'>
        <label htmlFor='description' className='text-muted'>
          Description
        </label>
        <textarea
          type='text'
          className='form-control'
          name='description'
          value={description}
          onChange={handleChange}
        />
      </div>
      {/* product price */}
      <div className='form-group'>
        <label htmlFor='price' className='text-muted'>
          Price
        </label>
        <input
          type='number'
          className='form-control'
          name='price'
          value={price}
          onChange={handleChange}
        />
      </div>
      {/* product category */}
      <div className='form-group'>
        <label htmlFor='category' className='text-muted'>
          Category
        </label>
        <select
          className='form-control'
          name='category'
          onChange={handleChange}
        >
          <option>Please Select...</option>
          {categories &&
            categories.map((category, index) => (
              <option key={index} value={category._id}>
                {category.name}
              </option>
            ))}
        </select>
      </div>
      {/* product shipping */}
      <div className='form-group'>
        <label htmlFor='shipping' className='text-muted'>
          Shipping
        </label>
        <select
          className='form-control'
          name='shipping'
          onChange={handleChange}
        >
          <option>Please Select...</option>
          <option value='0'>No</option>
          <option value='1'>Yes</option>
        </select>
      </div>
      {/* product quantity */}
      <div className='form-group'>
        <label htmlFor='quantity' className='text-muted'>
          Quantity
        </label>
        <input
          type='text'
          className='form-control'
          name='quantity'
          value={quantity}
          onChange={handleChange}
        />
      </div>
      <button className='btn btn-outline-primary'>Create a product</button>
    </form>
  );
  return (
    <Layout
      title='Add a new product'
      description={`G'day ${user.name}, ready to add a new category`}
    >
      i
      <div className='row'>
        <div className='col-md-8 offset-md-2'>
          {showLoading()}
          {showSuccess()}
          {showError()}
          {newProductForm()}
        </div>
      </div>
    </Layout>
  );
};

export default AddProduct;
