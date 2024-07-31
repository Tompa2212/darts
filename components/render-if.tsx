import React from 'react';

type RenderIfProps = {
  condition: boolean;
  children: React.ReactNode;
};

function RenderIf({ condition, children }: RenderIfProps) {
  if (condition) {
    return children;
  }

  return null;
}

export default RenderIf;
