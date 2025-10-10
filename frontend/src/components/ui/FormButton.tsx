import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}

const FormButton: React.FC<ButtonProps> = ({
  children,
  type = "button",
  disabled = false,
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="mt-3.5 bg-blue hover:bg-darkblue transition-all duration-300 text-text h-[38px] rounded-lg cursor-pointer disabled:cursor-default disabled:bg-darkblue"
    >
      {children}
    </button>
  );
};
export default FormButton;
