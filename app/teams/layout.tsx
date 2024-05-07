import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="container py-4">{children}</div>;
};

export default layout;
