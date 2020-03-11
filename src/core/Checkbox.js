import React, { useState, useEffect } from "react";

const Checkbox = ({ categories, handleFilters }) => {
  const [checked, setChecked] = useState([]);

  const handleCheck = event => {
    const currentCategoryId = checked.indexOf(event.target.name);
    const newCheckedCategoryId = [...checked];
    if (currentCategoryId === -1) {
      newCheckedCategoryId.push(event.target.name);
    } else {
      newCheckedCategoryId.splice(currentCategoryId, 1);
    }
    setChecked(newCheckedCategoryId);
    // console.log(newCheckedCategoryId);

    // pass checked categories ids to parent(Shop)
    handleFilters(newCheckedCategoryId, "category");
  };

  return categories.map((category, index) => (
    <li key={index} className='list-unstyled'>
      <input
        onChange={handleCheck}
        type='checkbox'
        className='form-check-input'
        name={category._id}
      />
      <label className='form-check-label'>{category.name}</label>
    </li>
  ));
};

export default Checkbox;
