import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth/index";
import { Link } from "react-router-dom";
import { getPurchaseHistory } from "./apiUser";
import moment from "moment";

const UserDashboard = () => {
  const [history, setHistory] = useState([]);

  const {
    user: { id, name, email, role }
  } = isAuthenticated();

  const init = (userId, token) => {
    getPurchaseHistory(userId, token).then(data => {
      if (data.error) {
        console.log("1");
        console.log(data.error);
      } else {
        setHistory(data);
      }
    });
  };

  useEffect(() => {
    init(id, isAuthenticated().token);
  }, []);

  // user links
  const userLinks = () => (
    <div className='card'>
      <h4 className='card-header'>User Links</h4>
      <ul className='list-group'>
        <li className='list-group-item'>
          <Link className='nav-link' to='/cart'>
            My Cart
          </Link>
        </li>
        <li className='list-group-item'>
          <Link className='nav-link' to={`/profile/${id}`}>
            Update Profile
          </Link>
        </li>
      </ul>
    </div>
  );

  // user info
  const userInfo = () => (
    <div className='card mb-5'>
      <h3 className='card-header'>User Information</h3>
      <ul className='list-group'>
        <li className='list-group-item'>{name}</li>
        <li className='list-group-item'>{email}</li>
        <li className='list-group-item'>
          {role === 1 ? "Admin" : "Registered User"}
        </li>
      </ul>
    </div>
  );

  // user purchase history
  const purchaseHistory = history => {
    return (
      <div className='card mb-5'>
        <h3 className='card-header'>Purchase history</h3>
        <ul className='list-group'>
          <li className='list-group-item'>
            {history.map((h, i) => {
              return (
                <div key={i}>
                  <hr />
                  {h.products.map((p, i) => {
                    return (
                      <div key={i}>
                        <h6>Product name: {p.name}</h6>
                        <h6>Product price: ${p.price}</h6>
                        <h6>Purchased date: {moment(p.createdAt).fromNow()}</h6>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </li>
        </ul>
      </div>
    );
  };

  return (
    <Layout
      title='Dashboard'
      description={`G'day ${name}!`}
      className='container'
    >
      <div className='row'>
        <div className='col-3'>{userLinks()}</div>
        <div className='col-9'>
          {userInfo()}
          {purchaseHistory(history)}
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
