import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getAllCategories, list } from "./apiCore";
import Card from "./Card";

const Search = () => {
  const [data, setData] = useState({
    categories: [],
    category: "",
    search: "",
    results: [],
    searched: false
  });

  const { categories, category, search, results, searched } = data;

  useEffect(() => {
    loadCategories();
  }, []);

  // get all categories search select
  const loadCategories = () => {
    getAllCategories().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setData({ ...data, categories: data });
      }
    });
  };

  const handleChange = event => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
      searched: false
    });
  };

  const handleSubmit = event => {
    event.preventDefault();
    searchData();
  };
  const searchData = () => {
    // 就是搜索框🔍如果有东西的话就执行下面👇代码
    if (search) {
      // this is search params passing to apiCore
      list({ search: search || undefined, category: category }).then(
        response => {
          if (response.error) {
            console.log(response.error);
          } else {
            setData({ ...data, results: response, searched: true });
          }
        }
      );
    }
  };

  // promp message
  const searchMessage = (searched, results) => {
    if (searched && results.length > 0) {
      return `Found ${results.length} products`;
    }
    if (searched && results.length == 0) {
      return `No products found`;
    }
  };
  const searchedProducts = (results = []) => (
    <div>
      <h2 className='mt-4 mb-4'>{searchMessage(searched, results)}</h2>
      <div className='row'>
        {results.map((product, index) => (
          <Card key={index} product={product} />
        ))}
      </div>
    </div>
  );

  const searchFrom = () => (
    <form onSubmit={handleSubmit}>
      <span className='input-group-text'>
        <div className='input-group input-group-lg'>
          <select className='btn mr-2' onChange={handleChange} name='category'>
            <option value='All'>Pick Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* 下面👇input的输入就是search的值 */}
          <input
            type='search'
            className='form-control'
            onChange={handleChange}
            placeholder='Search by name'
            name='search'
          />
        </div>
        <div className='btn input-group-append' style={{ border: "none" }}>
          <button className='input-group-text'>Search</button>
        </div>
      </span>
    </form>
  );

  return (
    <div className='row'>
      <div className='container mb-3'>{searchFrom()}</div>
      <div className='container-fluid mb-3'>{searchedProducts(results)}</div>
    </div>
  );
};

export default Search;
