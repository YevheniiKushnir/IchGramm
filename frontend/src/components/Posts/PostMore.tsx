import {
  Dispatch,
  MouseEvent,
  RefObject,
  SetStateAction,
  useState,
} from "react";
import { useLocation, useParams } from "react-router";
import { deletePost } from "../../utils/apiCalls/postApi.ts";

type EditPostProps = {
  modalRef: RefObject<HTMLDivElement>;
  postId: string | undefined;
  setPostType: Dispatch<SetStateAction<"preview" | "edit">>;
};

const PostMore:React.FC<EditPostProps> = ({ modalRef, postId, setPostType }) => {
  const location = useLocation();
  const [showNotification, setShowNotification] = useState(false);
  const { username } = useParams();

  const copyToClipboard = () => {
    const fullUrl = `${window.location.origin}${location.pathname}`;
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        setShowNotification(true); // Show the notification
        setTimeout(() => {
          setShowNotification(false); // Automatically hide after 3 seconds
        }, 3000);
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
      });
  };

  const closeModal = (
    e: MouseEvent<HTMLDivElement> | MouseEvent<HTMLAnchorElement>
  ) => {
    if (modalRef.current) {
      e.stopPropagation();
      modalRef.current.hidden = true;
    }
  };

  const handleDeletePost = async () => {
    try {
      if (!postId || !modalRef.current) return;
      await deletePost(postId);
      window.location.href = `/profile/${username}`;
    } catch (error) {
      console.error("Could not delete post", error);
    }
  };

  return (
    <div
      className="fixed h-[calc(100vh-81px)] z-50 md:min-h-screen top-0 w-screen md:w-[calc(100vw-60px)] lg:w-[calc(100vw-244px)] left-0 md:left-[60px] lg:left-[244px]"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.65)" }}
      onClick={closeModal}
    >
      <div
        className="bg-background opacity-100 mt-36 mx-auto rounded-xl xl:w-[400px] md:w-[320px] w-[90vw]"
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div className="text-center">
          <p
            className="py-4 border-b border-b-gray text-error font-semibold cursor-pointer"
            onClick={handleDeletePost}
          >
            Delete
          </p>
          <p
            className="py-4 border-b border-b-gray cursor-pointer"
            onClick={(e) => {
              closeModal(e);
              setPostType("edit");
            }}
          >
            Edit
          </p>
          <p
            className="py-4 border-b border-b-gray cursor-pointer"
            onClick={closeModal}
          >
            Go to post
          </p>
          <p
            className="py-4 border-b border-b-gray cursor-pointer"
            onClick={copyToClipboard}
          >
            Copy link
          </p>
          <p className="py-4 cursor-pointer" onClick={closeModal}>
            Cancel
          </p>
        </div>
      </div>
      {showNotification && (
        <div
          className="fixed bottom-4 right-4 bg-background px-4 py-2 rounded shadow-md flex items-center gap-2"
        >
          <span>Link copied!</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowNotification(false);
            }}
            className="text-sm px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
export default PostMore;