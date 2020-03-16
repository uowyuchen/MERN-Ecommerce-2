import React, { useState, useEffect } from "react";
import { getBraintreeClientToken, processPayment } from "./apiCore";
import { isAuthenticated } from "../auth/index";
import { Link } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import { emptyCart } from "./cartHelpers";

const Checkout = ({ products, setRun = f => f, run = undefined }) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
    address: ""
  });

  const userId = isAuthenticated() && isAuthenticated().user.id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getBraintreeClientToken(userId, token).then(data => {
      if (data.error) {
        setData({ ...data, error: data.error });
      } else {
        setData({ clientToken: data.clientToken });
      }
    });
  };

  // get braintree token from backend
  useEffect(() => {
    getToken(userId, token);
  }, []);

  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const showCheckout = () => {
    return isAuthenticated() ? (
      <div>{showDropIn()}</div>
    ) : (
      <Link to='/signin'>
        <button className='btn btn-primary'>Sign in to checkout</button>
      </Link>
    );
  };

  const buy = () => {
    setData({ loading: true });
    // send the nonce to your server
    // nonce 由 data.instance.requestPaymentMethod()获得
    let nonce;
    let getNonce = data.instance
      .requestPaymentMethod()
      .then(data => {
        // console.log("data", data);
        nonce = data.nonce;
        // once your have nonce (card type, card number) send nonce as 'paymentMethodNonce'
        // and also totle to be charged
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getTotal()
        };
        processPayment(userId, token, paymentData)
          .then(response => {
            // 这个response返回了一系列成功付款之后的信息到前端
            // console.log(response);
            setData({ ...data, success: response.success });
            // 成功付款后 empty cart
            emptyCart(() => {
              setRun(!run);
              console.log("payment success and empty cart");
              setData({ loading: false });
            });
          })
          .catch(err => {
            console.log(err);
            setData({ loading: false });
          });
      })
      .catch(error => {
        console.log("dropin error: ", error);
        setData({ ...data, error: error.message });
      });
  };

  const showDropIn = () => (
    <div onBlur={() => setData({ ...data, error: "" })}>
      {/* 有clientToken并且此cart中有product */}
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          <DropIn
            options={{
              authorization: data.clientToken,
              paypal: {
                flow: "vault"
              }
            }}
            onInstance={instance => {
              // console.log(instance);
              return (data.instance = instance);
            }}
          />
          <button onClick={buy} className='btn btn-success btn-block'>
            Pay
          </button>
        </div>
      ) : null}
    </div>
  );

  const showError = error => (
    <div
      className='alert alert-danger'
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );
  const showSuccess = success => (
    <div
      className='alert alert-info'
      style={{ display: success ? "" : "none" }}
    >
      Thanks! Your payment was successful!
    </div>
  );
  const showLoading = loading => loading && <h2>Loading...</h2>;
  return (
    <div>
      <h2>Total: ${getTotal()}</h2>
      {showLoading(data.loading)}
      {showSuccess(data.success)}
      {showError(data.error)}
      {showCheckout()}
    </div>
  );
};

export default Checkout;
