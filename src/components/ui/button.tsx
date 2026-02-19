import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "secondary";
};

export const Button: React.FC<ButtonProps> = ({ children, className = "", variant, ...rest }) => {
  const variantClass = variant === "secondary" ? "opacity-90" : "";
  return (
    <button {...rest} className={`${className} ${variantClass}`.trim()}>
      {children}
    </button>
  );
};
