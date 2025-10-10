import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Picker, { EmojiClickData } from "emoji-picker-react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";
import { more } from "../../assets/general_icons/index.ts";
import { like, liked, comment } from "../../assets/post/index.ts";
import { emoji } from "../../assets/post/index.ts";

import { Post } from "../../store/types/instanceTypes.ts";
import { onLikeComment, onLikePost } from "../../utils/likeFunctions.ts";
import { addComment } from "../../utils/apiCalls/commentApi.ts";
import { formatDate } from "../../utils/formatFunctions.ts";
import { isLikedByUser } from "../../utils/likeFunctions.ts";

type PostMainProps = {
  post: Post | null;
  setPost: Dispatch<SetStateAction<Post | null>>;
  moreRef: RefObject<HTMLDivElement>;
};

const PostMain: React.FC<PostMainProps> = ({ post, setPost, moreRef }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const authUserId = useSelector((state: RootState) => state.auth.userId);
  const userStateId = useSelector((state: RootState) => state.user._id);

  const userId = authUserId || userStateId;

  type CommentFormInputs = {
    content: string;
  };
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<CommentFormInputs>({ mode: "onChange" });

  // Handle emoji click
  const onEmojiClick = (emojiData: EmojiClickData) => {
    const currentContent = watch("content") || ""; // Get current content value
    const newContent = currentContent + emojiData.emoji; // Append emoji to content
    setValue("content", newContent); // Update content using setValue
  };

  const onComment: SubmitHandler<CommentFormInputs> = async (
    data: CommentFormInputs
  ) => {
    try {
      if (post) {
        const newComment = await addComment(data.content, post?._id);
        if (newComment) {
          setPost((prev) => ({
            ...prev!,
            comments: [...(prev?.comments || []), newComment],
          }));
        }
        reset();
      }
    } catch (e) {
      console.error("Could not upload comment", e);
      setCommentError("Could not upload comment");
    }
  };

  return (
    <div className="flex flex-col overflow-y-scroll h-[calc(100%-150px)]">
      <div className="hidden lg:flex justify-between border-b border-b-gray">
        <Link to={`/profile/${post?.author?.username}`}>
          <div className="flex items-center gap-3 mx-3.5 my-4 text-xs">
            <img
              src={post?.author?.profile_image}
              alt="Profile image"
              className="w-6 h-6 rounded-[50%] border border-gray object-cover"
            />
            <span className="font-semibold">{post?.author?.username}</span>
          </div>
        </Link>
        {post?.author?._id.toString() === userId && (
          <img
            src={more}
            alt="More"
            className="w-6 mr-2 cursor-pointer"
            onClick={() => {
              if (moreRef.current) {
                moreRef.current.hidden = !moreRef.current.hidden;
              }
            }}
          />
        )}
      </div>
      <div className="flex gap-3 mx-3.5 my-3 text-xs">
        <Link to={`/profile/${post?.author?.username}`}>
          <img
            src={post?.author?.profile_image}
            alt="Profile image"
            className="min-w-6 max-w-6 h-6 object-cover rounded-[50%] border border-gray"
          />
        </Link>
        <div className="flex-col">
          <p>
            <Link to={`/profile/${post?.author?.username}`}>
              <span className="font-semibold">{post?.author?.username}</span>
            </Link>
            <span> </span>
            {post?.content}
          </p>
          {post?.createdAt && (
            <p className="text-darkgray text-[11px] mt-2">
              {formatDate(new Date(post?.createdAt))}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col mb-3.5 px-3.5 text-xs gap-5">
        {post?.comments &&
          post?.comments.length > 0 &&
          post?.comments.map((comment) => (
            <div key={comment._id} className="flex justify-between">
              <div className="flex justify-between gap-3">
                <Link to={`/profile/${comment.author.username}`}>
                  <img
                    src={comment.author.profile_image}
                    alt={comment.author.username}
                    className="min-w-6 h-6 rounded-[50%] border border-gray"
                  />
                </Link>
                <div>
                  <Link to={`/profile/${comment.author.username}`}>
                    <p>{comment.author.username}</p>
                  </Link>
                  <p>{comment.content}</p>
                  <div className="flex text-darkgray text-[11px]">
                    {comment?.createdAt && (
                      <p className="mr-5">
                        {formatDate(new Date(comment?.createdAt))}
                      </p>
                    )}
                    <p>Likes: {comment?.like_count}</p>
                  </div>
                </div>
              </div>
              <img
                src={
                  userId && isLikedByUser(comment?.likes, userId) ? liked : like
                }
                alt={comment._id}
                className="w-2.5 h-2.5 cursor-pointer"
                onClick={(e) => onLikeComment(e, comment._id, post, setPost)}
              />
            </div>
          ))}
      </div>
      <div className="bg-background w-full absolute bottom-0">
        <div className="pl-3.5 mb-3 mt-2">
          <div className="flex gap-3 mb-2">
            <img
              src={
                userId && post?.likes && isLikedByUser(post?.likes, userId)
                  ? liked
                  : like
              }
              alt="like"
              className="w-6 h-6 cursor-pointer"
              onClick={(e) => {
                if (post?._id) {
                  onLikePost(e, post._id, post, setPost);
                  return;
                }
              }}
            />
            <img
              src={comment}
              alt="comment"
              className="cursor-pointer"
              onClick={() => setFocus("content")}
            />
          </div>
          <p className="text-xs font-semibold">{post?.like_count} likes</p>
          {post?.createdAt && (
            <p className="text-darkgray text-[11px] mt-2">
              {formatDate(new Date(post?.createdAt))}
            </p>
          )}
        </div>
        <div className="border-t border-t-gray">
          {errors.content && (
            <p className="pl-3.5 pt-2 text-xs text-error">
              The comment should be less than 120 characters
            </p>
          )}
          {commentError && (
            <p className="pl-3.5 pt-2 text-xs text-error">{commentError}</p>
          )}
          <form
            className="flex items-center justify-between pl-3.5 bg-background w-full"
            onSubmit={handleSubmit(onComment)}
          >
            <div className="flex items-center gap-4 w-full mr-4">
              <img
                src={emoji}
                alt="Emoji"
                className="w-6 h-6 cursor-pointer"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              />
              {showEmojiPicker && (
                <div className="absolute bottom-14">
                  <Picker
                    width={300}
                    height={300}
                    searchDisabled={true}
                    onEmojiClick={onEmojiClick}
                  />
                </div>
              )}
              <input
                {...register("content", { required: true, maxLength: 120 })}
                placeholder="Add comment"
                className="placeholder:text-xs p-2.5 w-full bg-decobackground text-text"
              />
            </div>
            <button
              type="submit"
              className="text-blue text-xs font-semibold pr-6 lg:pr-10"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostMain;
