import React, { useState } from 'react';

const CategoryRoute = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Category Route</h1>
      <p>Count: {count}</p>
    </div>
  );
};

export default CategoryRoute;
