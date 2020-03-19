import React, { useState, useEffect } from "react";
import moment from "moment";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth/index";
import { Link } from "react-router-dom";
import { listOrders, getStatusValues, updateOrderStatus } from "./apiAdmin";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusValuse, setStatusValues] = useState([]);

  const loadOrders = () => {
    listOrders(isAuthenticated().user.id, isAuthenticated().token).then(
      data => {
        if (data.error) {
          console.log(data.error);
        } else {
          setOrders(data);
        }
      }
    );
  };

  const loadStatusValues = () => {
    getStatusValues(isAuthenticated().user.id, isAuthenticated().token).then(
      data => {
        if (data.error) {
          console.log(data.error);
        } else {
          setStatusValues(data);
        }
      }
    );
  };

  const showStatus = order => (
    <div className='form-group'>
      <h3 className='mark mb-4'>Status: {order.status}</h3>
      <select
        className='form-control'
        name={order._id}
        onChange={handleStatusChange}
      >
        <option>Update Status</option>
        {statusValuse.map((status, index) => (
          <option key={index} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );

  const handleStatusChange = event => {
    // console.log(event.target.name); // 我把name设置成order的id
    // console.log(event.target.value); // 我把value设置成order的statu中的选项
    updateOrderStatus(
      isAuthenticated().user.id,
      isAuthenticated().token,
      event.target.name,
      event.target.value
    ).then(data => {
      if (data.error) {
        console.log("Status update failed");
      } else {
        loadOrders();
      }
    });
  };

  useEffect(() => {
    loadOrders();
    loadStatusValues();
  }, []);

  const showOrdersLength = () => {
    if (orders.length > 0) {
      return (
        <h1 className='text-danger display-2'>Total Orders: {orders.length}</h1>
      );
    } else {
      return <h1 className='text-danger'>No orders</h1>;
    }
  };

  const showInput = (key, value) => {
    return (
      <div className='input-group mb-2 mr-sm-2'>
        <div className='input-group-prepend'>
          <div className='input-group-text'>{key}</div>
        </div>
        <input type='text' value={value} className='form-control' readOnly />
      </div>
    );
  };

  return (
    <Layout title='Orders' description='You can manage your orders here'>
      <div className='col-md-8 offset-md-2'>
        {showOrdersLength()}
        {orders.map((order, index) => {
          return (
            <div
              className='mt-5'
              style={{ borderBottom: "5px solid indigo" }}
              key={index}
            >
              <h2 className='mb-5'>
                <span className='bg-primary'>Order ID: {order._id}</span>
              </h2>

              {/* look through all orders */}
              <ul className='list-group mb-2'>
                <li className='list-group-item'>{showStatus(order)}</li>
                <li className='list-group-item'>
                  Transaction ID: {order.transaction_id}
                </li>
                <li className='list-group-item'>Amount: {order.amount}</li>
                <li className='list-group-item'>Order by: {order.user.name}</li>
                <li className='list-group-item'>
                  Ordered on: {moment(order.createdAt).fromNow()}
                </li>
                <li className='list-group-item'>
                  Delivery address: {order.address}
                </li>
              </ul>
              <h3 className='mt-4 mb-4 font-italic'>
                Total products in the order: {order.products.length}
              </h3>

              {/* look through products in orders */}
              {order.products.map((product, index) => (
                <div
                  className='mb-4'
                  key={index}
                  style={{ padding: "20px", border: "1px solid indigo" }}
                >
                  {showInput("Product name", product.name)}
                  {showInput("Product price", product.price)}
                  {showInput("Product total", product.total)}
                  {showInput("Product Id", product._id)}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default Orders;
