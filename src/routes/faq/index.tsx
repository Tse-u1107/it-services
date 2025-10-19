import React, { useState } from 'react';

const FaqRoute = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>FAQ Route</h1>
      <p>Count: {count}</p>
    </div>
  );
};

export default FaqRoute;
