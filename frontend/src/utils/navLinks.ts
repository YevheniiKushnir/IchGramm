import {
  home,
  homeFill,
  search,
  searchFill,
  explore,
  exploreFill,
  messages,
  messagesFill,
  notifications,
  notificationsFill,
  create,
  createFill,
} from "../assets/nav_icons";

type Link = {
  name: string;
  href: string;
  logo: string;
  logoFill: string;
};

const links: Link[] = [
  {
    name: "Home",
    href: "/",
    logo: home,
    logoFill: homeFill,
  },
  {
    name: "Search",
    href: "/search",
    logo: search,
    logoFill: searchFill,
  },
  {
    name: "Explore",
    href: "/explore",
    logo: explore,
    logoFill: exploreFill,
  },
  {
    name: "Messages",
    href: "/messages",
    logo: messages,
    logoFill: messagesFill,
  },
  {
    name: "Notifications",
    href: "/notifications",
    logo: notifications,
    logoFill: notificationsFill,
  },
  {
    name: "Create",
    href: "/create",
    logo: create,
    logoFill: createFill,
  },
];

export default links;
