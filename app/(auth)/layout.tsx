import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="xs:p-4 container flex h-full justify-center p-0">{children}</div>;
};

export default layout;
