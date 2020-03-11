import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import Card from "./Card";
import { getAllCategories, getFilteredProducts } from "./apiCore";
import Checkbox from "./Checkbox";
import RadioBox from "./RadioBox";
import { prices } from "./fixedPrice";

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);
  const [limit, setLimit] = useState(6);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(0); // 后台给我们返回🔙的
  const [filteredResults, setFilteredResults] = useState([]);
  const [myFilters, setMyFilters] = useState({
    filters: { category: [], price: [] }
  });

  // load all filtered prodcut by categories & price
  const loadFilteredResults = newFilters => {
    getFilteredProducts(skip, limit, newFilters).then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        setFilteredResults(data.data);
        setSize(data.size);
        setSkip(0);
      }
    });
  };

  // for load more button
  const loadMore = () => {
    let toSkip = skip + limit;
    getFilteredProducts(toSkip, limit, myFilters.filters).then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        setFilteredResults([...filteredResults, ...data.data]);
        setSize(data.size);
        setSkip(toSkip);
      }
    });
  };
  // load more button
  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button onClick={loadMore} className='btn btn-warning mb-5'>
          Load more
        </button>
      )
    );
  };

  // get checked categories form Checkbox C
  const handleFilters = (filters, filterBy) => {
    const newFilters = { ...myFilters };
    newFilters.filters[filterBy] = filters;

    // set price filter
    if (filterBy === "price") {
      let priceValues = handlPrice(filters);
      newFilters.filters[filterBy] = priceValues;
    }

    setMyFilters(newFilters);

    loadFilteredResults(myFilters.filters);
    // console.log(myFilters);
  };

  const handlPrice = value => {
    const data = prices;
    let array = [];
    for (let key in data) {
      if (data[key]._id == parseInt(value)) {
        array = data[key].array;
      }
    }
    return array;
  };

  // get all categories from DB
  const initAllCategories = () => {
    getAllCategories().then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        setCategories(data);
      }
    });
  };

  useEffect(() => {
    initAllCategories();
    loadFilteredResults(skip, limit, myFilters.filters);
  }, []);

  return (
    <Layout
      title='Shop Page'
      description='Search and find books of your choice'
      className='container-fluid'
    >
      <div className='row'>
        <div className='col-4'>
          {/* categories checkbox */}
          <h4>Filter by categories</h4>
          <ul>
            <Checkbox categories={categories} handleFilters={handleFilters} />
          </ul>

          {/* price radio */}
          <h4>Filter by price range</h4>
          <div>
            <RadioBox prices={prices} handleFilters={handleFilters} />
          </div>
        </div>
        <div className='col-8'>
          <h2 className='mb-4'>Products</h2>
          <div className='row'>
            {filteredResults.map((product, index) => (
              <Card key={index} product={product} />
            ))}
          </div>
          <hr />
          {loadMoreButton()}
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
