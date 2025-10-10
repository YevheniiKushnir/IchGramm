import React, { ReactNode } from "react";
import { Link } from "react-router";

type NavItemProps = {
  link: {
    name: string;
    href: string;
    logo: string;
    logoFill: string;
  };
  hoveredLink: string | null;
  setHoveredLink: (link: string | null) => void;
  location: any;
  children?: ReactNode;
  isModalItem?: boolean;
  onClick?: () => void;
};

const NavItem: React.FC<NavItemProps> = ({
  link,
  hoveredLink,
  setHoveredLink,
  location,
  children,
  isModalItem = false,
  onClick,
}) => {
  const isActive =
    location.pathname === link.href ||
    (link.href === "/messages" && location.pathname.startsWith("/messages"));

  const content = (
    <div
      className={`flex lg:gap-4 flex-col lg:flex-row items-center cursor-pointer ${
        !isModalItem ? "mx-auto lg:mx-0" : ""
      }`}
      onMouseOver={() => setHoveredLink(link.name)}
      onMouseLeave={() => setHoveredLink(null)}
      onClick={onClick}
    >
      <img
        src={hoveredLink === link.name || isActive ? link.logoFill : link.logo}
        alt={link.name}
        className="dark:invert"
      />
      <span className="hidden lg:block">{link.name}</span>
      {children}
    </div>
  );

  if (isModalItem) {
    return content;
  }

  return <Link to={link.href}>{content}</Link>;
};

export default NavItem;
