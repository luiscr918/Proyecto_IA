import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "secondary";
};

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = "", 
  variant, 
  disabled,
  ...rest 
}) => {
  const variantClass = variant === "secondary" ? "opacity-90" : "";
  const disabledClass = disabled ? "cursor-not-allowed opacity-50" : "";
  
  return (
    <button 
      {...rest} 
      disabled={disabled}
      className={`${className} ${variantClass} ${disabledClass}`.trim()}
    >
      {children}
    </button>
  );
};
