import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { className?: string };

export const Input: React.FC<InputProps> = ({ className = "", ...rest }) => {
  return <input className={className} {...rest} />;
};
