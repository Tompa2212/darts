import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="p-0 xs:p-4 container h-full flex justify-center">
      {children}
    </div>
  );
};

export default layout;
