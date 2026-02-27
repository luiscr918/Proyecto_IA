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
  const baseClass =
    "cursor-pointer inline-flex items-center justify-center transition-all duration-200";

  const variantClass = variant === "secondary" ? "opacity-90" : "";

  const disabledClass = disabled
    ? "cursor-not-allowed opacity-50"
    : "";

  return (
    <button
      {...rest}
      disabled={disabled}
      className={`${baseClass} ${variantClass} ${disabledClass} ${className}`.trim()}
    >
      {children}
    </button>
  );
};