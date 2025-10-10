import React from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  children: React.ReactNode;
  color: "gray" | "blue";
  onClick?: () => void;
  classes?: string;
  isLink?: boolean;
  to?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  color,
  onClick,
  classes = "",
  isLink,
  to,
}) => {
  const styles =
    color === "blue"
      ? "bg-blue hover:bg-darkblue text-background"
      : "bg-gray hover:bg-darkgray text-text";

  if (isLink) {
    return (
      <Link
        to={to!}
        className={
          `flex items-center justify-center text-center rounded-lg transition-all duration-200 text-sm h-7 w-28 sm:w-36 md:w-[190px] cursor-pointer ` +
          styles
        }
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={
        `flex items-center justify-center rounded-lg text-center text-sm cursor-pointer h-7 w-20 sm:w-28 md:w-[132px] transition-all duration-200 ` +
        styles +
        " " +
        classes
      }
    >
      {children}
    </button>
  );
};
export default Button;
