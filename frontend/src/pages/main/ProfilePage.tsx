import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";
import { User } from "../../store/types/instanceTypes.ts";
import { PostModal } from "../../components/Posts";
import ProfileHeader from "../../components/ProfileHeader.tsx";
import { fetchProfile } from "../../utils/apiCalls/userApi.ts";
import { Spinner } from "../../components/ui/index.ts";
import { FiLayers } from "react-icons/fi";

const ProfilePage = () => {
  const { username } = useParams();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const user = useSelector((state: RootState) => state.user);
  const location = useLocation();

  const isModal = location.pathname.includes("/post/");

  useEffect(() => {
    const fetchUserFunc = async () => {
      if (!username) return;
      if (user.username !== username) {
        const result = await fetchProfile(username);
        setCurrentUser(result);
      } else {
        setCurrentUser(user);
      }
    };
    fetchUserFunc();
  }, [username, user]);

  if (!currentUser) return <Spinner />;

  return (
    <div className="flex flex-col items-center gap-8 mx-auto max-w-[930px] md:my-9 lg:gap-16 w-full">
      <div className="w-full text-center border-b border-b-gray md:hidden p-2 font-semibold">
        {currentUser?.username}
      </div>
      <div className="flex flex-col gap-8 lg:gap-16">
        <ProfileHeader user={currentUser} profileUsername={user.username} />
        <div className="grid grid-cols-3 px-2 sm:px-6 gap-1 sm:gap-2">
          {currentUser?.posts &&
            currentUser.posts.length > 0 &&
            [...currentUser.posts].reverse().map((post) => (
              <div key={post._id} className="relative aspect-square">
                <Link
                  to={`/post/${post._id}`}
                  state={{ backgroundLocation: location }}
                >
                  <img
                    src={post.photos[0].url}
                    alt={post._id}
                    className="w-full h-full object-cover"
                  />
                </Link>
                {post.photos.length > 1 && (
                  <FiLayers className="absolute top-3 right-3" />
                )}
              </div>
            ))}
        </div>
      </div>
      {isModal && <PostModal />}
    </div>
  );
};

export default ProfilePage;
