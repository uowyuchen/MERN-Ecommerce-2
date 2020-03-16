import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import ShowImage from "./ShowImage";
import moment from "moment";
import { addItem, updateItem, removeItem } from "./cartHelpers";

const Card = ({
  product,
  showViewProductButton = true,
  showAddToCartButtonInCart = true,
  cartUpdate = false,
  showRemoveProductButton = false,
  setRun = f => f, // default value of function
  run = undefined // default value of undefined
}) => {
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);

  const showViewButton = showViewProductButton => {
    return (
      showViewProductButton && (
        <Link to={`/product/${product._id}`} className='mr-2'>
          <button className='btn btn-outline-warning mt-2 mb-2'>
            View Product
          </button>
        </Link>
      )
    );
  };

  const showAddToCartButton = showAddToCartButtonInCart => {
    return (
      showAddToCartButtonInCart && (
        <button onClick={addToCart} className='btn btn-outline-info mt-2 mb-2'>
          Add to Cart
        </button>
      )
    );
  };

  const addToCart = () => {
    //     sold: 0
    // _id: "5e6923ec543bb78139f71ca0"
    // name: "test5"
    // description: "dfhjukttbnr"
    // price: 45
    // category: {_id: "5e49e6d9a7e3348458fb3d7a", name: "Node", createdAt: "2020-02-17T01:05:29.888Z", updatedAt: "2020-02-17T01:05:29.888Z", __v: 0}
    // shipping: true
    // quantity: 3
    // createdAt: "2020-03-11T17:46:20.233Z"
    // updatedAt: "2020-03-11T17:46:20.233Z"
    addItem(product, () => {
      setRedirect(true);
    });
  };

  const shouldRedirect = redirect => {
    if (redirect) {
      return <Redirect to='/cart' />;
    }
  };

  // 显示是否有存活
  const showStock = quantity =>
    quantity > 0 ? (
      <span className='badge badge-primary badge-pill'>In Stock</span>
    ) : (
      <span className='badge badge-primary badge-pill'>Out of Stock</span>
    );

  // 改变一个product item的数量
  const handleChange = event => {
    setRun(!run); // run useEffect in parent Cart

    // 这是为了input中的value不可能小于1
    setCount(event.target.value < 1 ? 1 : event.target.value);
    if (event.target.value >= 1) {
      updateItem(product._id, event.target.value);
    }
  };
  // 显示增加product item的地方
  const showCartUpdateOptions = cartUpdate => {
    return (
      cartUpdate && (
        <div>
          <div className='input-group mb-3'>
            <div className='input-group-prepend'>
              <span className='input-group-text'>Adjust Quantity</span>
              <input
                value={count}
                onChange={handleChange}
                name={product._id}
                type='number'
                className='form-control'
              />
            </div>
          </div>
        </div>
      )
    );
  };

  // remove cart item
  const showRemoveButton = showRemoveProductButton => {
    return (
      showRemoveProductButton && (
        <button
          onClick={() => {
            removeItem(product._id);
            setRun(!run); //run useEffect in parent Cart
          }}
          className='btn btn-outline-danger mt-2 mb-2'
        >
          Remove
        </button>
      )
    );
  };

  return (
    <div className='card'>
      <div className='card-header name'>{product.name}</div>
      <div className='card-body'>
        {/* redirect to cart after add to cart  */}
        {shouldRedirect(redirect)}

        <ShowImage item={product} url='products' />
        <p className='lead mt-2'>{product.description.substring(0, 10)}...</p>
        <p className='black-10'>$ {product.price}</p>
        <p className='black-9'>
          Category: {product.category && product.category.name}
        </p>
        <p className='black-8'>
          Added on {moment(product.createdAt).fromNow()}
        </p>
        {showStock(product.quantity)}
        <br />
        {showViewButton(showViewProductButton)}

        {showAddToCartButton(showAddToCartButtonInCart)}

        {showRemoveButton(showRemoveProductButton)}

        {showCartUpdateOptions(cartUpdate)}
      </div>
    </div>
  );
};

export default Card;
