import { MouseEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";

import { more, arrowBack } from "../../assets/general_icons/index.ts";
import { Post } from "../../store/types/instanceTypes.ts";
import { fetchPost } from "../../store/actionCreators/postActionCreators.ts";
import PostMain from "./PostMain";
import EditPostForm from "./EditPostForm";
import PhotoCarousel from "./PhotoCarousel";
import PostMore from "./PostMore";
import { Spinner } from "../ui/index.ts";

const PostModal = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [postType, setPostType] = useState<"preview" | "edit">("preview");
  const moreRef = useRef<HTMLDivElement>(null);
  const { _id } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const { postId } = useParams();
  const navigate = useNavigate();

  const closeModal = () => {
    navigate(-1); // Go back to the previous route (profile page)
  };

  useEffect(() => {
    const fetchPostFunc = async () => {
      if (!postId) return;
      const result = await dispatch(fetchPost({ id: postId })).unwrap();
      setPost(result);
    };
    fetchPostFunc();
  }, [postId, dispatch]);

  if (!post) return <Spinner />;

  return (
    <>
      {post?.author?._id === _id && (
        <div hidden ref={moreRef}>
          <PostMore
            modalRef={moreRef}
            postId={post?._id}
            setPostType={setPostType}
          />
        </div>
      )}
      <div
        className="fixed z-20 h-[calc(100vh-81px)] md:h-screen w-screen lg:w-[calc(100vw-244px)] top-0 left-0 md:left-[60px] lg:left-[244px]"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.65)" }}
        onClick={closeModal}
      >
        <div className="flex justify-center mt-6 h-[90%] md:h-full md:mt-0 md:items-center  w-full">
          <div
            className="flex flex-col w-[80vw] md:w-fit mx-6 opacity-100 z-10 rounded bg-background"
            onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <div className="md:hidden flex w-full justify-between border-b border-b-gray px-4 py-2 font-semibold">
              <img
                src={arrowBack}
                alt="Back"
                className="cursor-pointer"
                onClick={closeModal}
              />
              {post?.author.username}
              {post?.author?._id === _id ? (
                <p></p>
              ) : (
                <img
                  src={more}
                  alt="More"
                  className="justify-self-end"
                  onClick={() => {
                    if (moreRef.current) {
                      moreRef.current.hidden = false;
                    }
                  }}
                />
              )}
            </div>
            <div className="flex flex-col md:flex-row justify-center  overflow-auto h-full">
              <div className="flex justify-center items-center md:min-w-[280px] lg:min-w-[353px] max-h-[360px] md:max-h-[680px]">
                {post?.photos && post?.photos?.length > 1 ? (
                  <PhotoCarousel
                    photos={post?.photos.map(
                      (photoField) => photoField.url || ""
                    )}
                  />
                ) : (
                  <img
                    src={post?.photos[0].url}
                    alt="Post"
                    className="w-full object-contain"
                  />
                )}
              </div>
              {postType === "preview" ? (
                <div className="relative border-l border-gray w-full h-[460px] md:min-h-full md:w-[423px] overflow-y-auto">
                  <PostMain post={post} setPost={setPost} moreRef={moreRef} />
                </div>
              ) : (
                <EditPostForm
                  postContent={post?.content}
                  postId={post?._id}
                  setPost={setPost}
                  setPostType={setPostType}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostModal;
