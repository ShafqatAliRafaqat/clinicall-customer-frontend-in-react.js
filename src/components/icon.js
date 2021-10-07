import React from "react";

export const Icon = (props) => {
  const width = props.width || 20;
  const height = props.height || 20;
  return <props.icon width={width} height={height} />;
};
