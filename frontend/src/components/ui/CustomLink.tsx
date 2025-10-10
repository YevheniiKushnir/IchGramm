import React from "react";
import { Link } from "react-router-dom";

interface CustomLinkProps {
  children: React.ReactNode;
  to: string;
  classes?: string;
}

const CustomLink: React.FC<CustomLinkProps> = ({ children, to, classes }) => {
  return (
    <Link
      to={to}
      className={
        `text-blue transition-all duration-200 hover:text-darkblue text-inherit ` +
        classes
      }
    >
      {children}
    </Link>
  );
};

export default CustomLink;
