import React, { useState, useEffect, Fragment } from "react";

const RadioBox = ({ prices, handleFilters }) => {
  const [value, setValue] = useState(0);

  const handleChange = event => {
    handleFilters(event.target.value, "price");
    setValue(event.target.value);
  };

  return prices.map((price, index) => (
    <div key={index}>
      <input
        onChange={handleChange}
        type='radio'
        className='mr-2 ml-4'
        value={price._id}
        name={price}
      />
      <label className='form-check-label'>{price.name}</label>
    </div>
  ));
};

export default RadioBox;
