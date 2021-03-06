import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getAllProducts } from "./apiCore";
import Card from "./Card";
import Search from "./Search";

const Home = () => {
  const [productsBySell, setProductsBySell] = useState([]);
  const [productsByArrival, setProductsByArrival] = useState([]);
  const [error, setError] = useState(false);

  // list products by sold account
  const loadProductsBySell = () => {
    getAllProducts("sold").then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductsBySell(data);
      }
    });
  };
  // list products by arrival time
  const loadProductsByArrival = () => {
    getAllProducts("createdAt").then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductsByArrival(data);
      }
    });
  };

  useEffect(() => {
    loadProductsBySell();
    loadProductsByArrival();
  }, []);

  return (
    <Layout
      title='Home Page'
      description='Node React E-commerce App'
      className='container-fluid'
    >
      {/* for search product */}
      <Search />

      <h2 className='mb-4'>New Arrival</h2>
      <div className='row'>
        {productsByArrival.map((product, index) => (
          <div key={index} className='col-4 mb-3'>
            <Card product={product}></Card>
          </div>
        ))}
      </div>
      <hr />
      <h2 className='mb-4'>Best Sellers</h2>
      <div className='row'>
        {productsBySell.map((product, index) => (
          <div key={index} className='col-4 mb-3'>
            <Card product={product}></Card>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Home;
