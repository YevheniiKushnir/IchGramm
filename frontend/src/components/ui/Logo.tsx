import React from "react";
import { logo } from "../../assets/general_icons";

interface LogoProps {
  classes?: string;
}

const Logo: React.FC<LogoProps> = ({classes}) => {
  return <img src={logo} alt="Ichgram" className={`dark:invert ` + classes} />;
};

export default Logo;
