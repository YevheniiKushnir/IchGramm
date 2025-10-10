import { MouseEvent } from "react";
import { Link } from "react-router";
import Picker from "emoji-picker-react";
import { upload } from "../../assets/bg_deco_imgs/index.ts";
import { emoji } from "../../assets/post/index.ts";
import { arrowBack } from "../../assets/general_icons/index.ts";
import PhotoCarousel from "./PhotoCarousel";
import { useCreatePost } from "../../utils/customHooks.ts";
import { FiRefreshCw } from "react-icons/fi";

interface CreatePostProps {
  userId: string | null;
  profileImage: string;
  username: string;
  setIsCreatePostOpen: (isOpen: boolean) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({
  userId,
  username,
  profileImage,
  setIsCreatePostOpen,
}) => {
  const {
    content,
    setContent,
    photos,
    previews,
    showEmojiPicker,
    setShowEmojiPicker,
    creating,
    error,
    handleFileChange,
    onEmojiClick,
    handleSubmit,
    resetForm,
  } = useCreatePost(userId, setIsCreatePostOpen);

  // Close the create post modal
  const closeCreatePost = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsCreatePostOpen(false);
    setShowEmojiPicker(false); // Close emoji picker
    resetForm();
  };

  return (
    <div
      className="absolute z-20 left-0 -top-0 md:-top-7 h-[calc(100vh-81px)] md:h-screen w-screen md:w-[calc(100vw-58px)] lg:w-[calc(100vw-244px)] md:left-[60px] lg:left-[220px]"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.65)" }}
      onClick={closeCreatePost}
    >
      <div
        className="bg-background border border-gray opacity-100 mt-8 md:mt-20 mx-auto rounded-xl xl:w-[913px] lg:w-[800px] md:w-[510px] w-[90vw]"
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {error && <div className="p-4 text-error text-center">{error}</div>}
        <form
          onSubmit={handleSubmit}
          className="flex justify-between p-4 border-b border-b-gray"
        >
          <img
            src={arrowBack}
            alt="Back"
            className="cursor-pointer"
            onClick={closeCreatePost}
          />
          <p className="font-semibold">Create new post</p>
          <div className="relative">
            {creating && (
              <FiRefreshCw
                className="absolute -left-8 animate-spin text-blue"
                size={24}
              />
            )}
            <input
              type="submit"
              disabled={content.length === 0 || photos.length === 0}
              className={
                content.length === 0 || photos.length === 0
                  ? "text-gray"
                  : "text-blue cursor-pointer"
              }
              value="Share"
            />
          </div>
        </form>
        <div className="flex flex-col md:flex-row">
          <div className="relative flex items-center justify-center h-[320px] md:w-[280px] md:h-[280px] lg:w-[420px] lg:h-[420px] xl:w-[520px] xl:h-[520px] bg-gray">
            {previews.length > 0 ? (
              <PhotoCarousel
                croppedStyle={true}
                photos={previews.map((preview) => preview.url)}
                previews={previews}
              />
            ) : (
              <img src={upload} alt="upload" />
            )}
            <input
              type="file"
              className="cursor-pointer opacity-0 absolute top-0 left-0 bottom-0 right-0 w-full h-full"
              onChange={handleFileChange}
              multiple
            />
          </div>
          <div className="flex flex-col px-4 py-6 md:w-[42%]">
            <Link to={`profile/${userId}`}>
              <div className="flex items-center gap-4">
                <img
                  src={profileImage}
                  alt="Profile image"
                  className="w-6 h-6 rounded-[50%] border border-gray"
                />
                <p className="font-semibold">{username}</p>
              </div>
            </Link>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="resize-none w-full h-32 lg:h-52 mt-4 p-3 text-text bg-decobackground"
              maxLength={2200}
            />
            <p className="text-gray self-end">{content.length}/2200</p>
            <div className="relative border-b border-b-gray pb-3 mt-6">
              <img
                src={emoji}
                alt="Emoji"
                className="cursor-pointer"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              />
              {showEmojiPicker && (
                <div className="absolute bottom-28 md:bottom-0 z-10 -right-50 md:right-60 lg:right-80 xl:right-96">
                  <Picker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatePost;
