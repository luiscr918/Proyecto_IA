import React from "react";

export const ScrollArea: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...rest }) => {
  return (
    <div className={`overflow-auto ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
};
