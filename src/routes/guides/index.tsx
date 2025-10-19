import React, { useState } from 'react';

const GuideRoute = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Guide Route</h1>
      <p>Count: {count}</p>
    </div>
  );
};

export default GuideRoute;
