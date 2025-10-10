import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import links from "../../utils/navLinks";
import { CreatePost } from "../Posts";
import { NotificationsModal, SearchModal } from "../Layout/Sidebars";
import { useFetchUserAfterReload } from "../../utils/customHooks.ts";
import { FiLogOut } from "react-icons/fi";
import { logoutUser } from "../../store/actionCreators/authActionCreators.ts";
import { Logo, NavItem } from "../ui/index.ts";

const Navigation = () => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState<boolean>(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState<boolean>(false);
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  useFetchUserAfterReload(user);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div
      className="z-20 bg-background flex justify-center md:border-r border-t md:border-t-0 border-gray py-7 lg:px-4 min-w-full md:min-w-[60px] lg:min-w-[244px]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex justify-around w-full md:w-fit mx-10 md:mx-0 md:justify-start lg:fixed top-7 md:flex-col items-center gap-4 min-w-[60px]">
        <Link to="/" className="hidden md:flex">
          <Logo classes="hidden md:block" />
        </Link>
        <div className="flex md:flex-col items-center justify-around lg:items-start lg:px-2 gap-4 md:mt-6 min-w-full">
          <NavItem
            link={links[0]}
            hoveredLink={hoveredLink}
            setHoveredLink={setHoveredLink}
            location={location}
          />

          <NavItem
            link={links[1]}
            hoveredLink={hoveredLink}
            setHoveredLink={setHoveredLink}
            location={location}
            isModalItem={true}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <div
              className={isSearchOpen ? "opacity-100" : "opacity-0 invisible"}
            >
              <SearchModal
                isSearchOpen={isSearchOpen}
                setIsSearchOpen={setIsSearchOpen}
              />
            </div>
          </NavItem>

          <NavItem
            link={links[2]}
            hoveredLink={hoveredLink}
            setHoveredLink={setHoveredLink}
            location={location}
          />

          <NavItem
            link={links[3]}
            hoveredLink={hoveredLink}
            setHoveredLink={setHoveredLink}
            location={location}
          />

          <NavItem
            link={links[4]}
            hoveredLink={hoveredLink}
            setHoveredLink={setHoveredLink}
            location={location}
            isModalItem={true}
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <div
              className={`z-20 ${
                isNotificationsOpen ? "opacity-100" : "opacity-0 invisible"
              }`}
            >
              <NotificationsModal
                isNotificationsOpen={isNotificationsOpen}
                setIsNotificationsOpen={setIsNotificationsOpen}
                notifications={user?.notifications}
              />
            </div>
          </NavItem>

          <NavItem
            link={links[5]}
            hoveredLink={hoveredLink}
            setHoveredLink={setHoveredLink}
            location={location}
            isModalItem={true}
            onClick={() => setIsCreatePostOpen(!isCreatePostOpen)}
          >
            <div
              className={
                isCreatePostOpen ? "opacity-100" : "opacity-0 invisible"
              }
            >
              <CreatePost
                userId={user?._id}
                username={user?.username}
                profileImage={user?.profile_image}
                setIsCreatePostOpen={setIsCreatePostOpen}
              />
            </div>
          </NavItem>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="mx-auto lg:mx-0 flex items-center gap-4 md:mt-12"
            >
              <img
                src={user?.profile_image}
                alt="Profile image"
                className="w-6 h-6 object-cover rounded-[50%] border border-gray"
              />
              <span className="font-semibold hidden lg:block">Profile</span>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute bottom-[50px] md:top-full left-0 mt-2 w-max md:w-48 bg-background border border-gray rounded-lg shadow-lg z-30">
                <Link
                  to={`profile/${user?.username}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-t-lg"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <img
                    src={user?.profile_image}
                    alt="Profile"
                    className="w-6 h-6 object-cover rounded-[50%]"
                  />
                  <span className="hidden md:inline">Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-red-500 rounded-b-lg border-t border-gray"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
