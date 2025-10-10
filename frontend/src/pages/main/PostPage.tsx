import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store.ts";
import { Post } from "../../store/types/instanceTypes.ts";
import { fetchPost } from "../../store/actionCreators/postActionCreators.ts";
import {
  PostMain,
  EditPostForm,
  PostMore,
  PhotoCarousel,
} from "../../components/Posts";

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [postType, setPostType] = useState<"preview" | "edit">("preview");
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPostFunc = async () => {
      if (!postId) return;
      const result = await dispatch(fetchPost({ id: postId })).unwrap();
      setPost(result);
    };
    fetchPostFunc();
  }, [postId, dispatch]);

  return (
    <>
      <div hidden ref={moreRef}>
        <PostMore
          modalRef={moreRef}
          postId={post?._id}
          setPostType={setPostType}
        />
      </div>
      <div className="mx-auto w-[90vw] md:w-fit  lg:max-h-[80vh] my-9">
        <div className="flex flex-col md:flex-row justify-center border border-gray overflow-auto h-full">
          <div
            className="flex justify-center items-center md:min-w-[280px]
                lg:min-w-[353px] md:max-w-[460px] max-h-[360px] md:max-h-[680px]"
          >
            {post?.photos && post?.photos?.length > 1 ? (
              <PhotoCarousel
                photos={post?.photos.map((photoField) => photoField.url || "")}
              />
            ) : (
              <img
                src={post?.photos[0].url}
                alt="Post"
                className="h-full w-full object-contain"
              />
            )}
          </div>
          {postType === "preview" ? (
            <div
              className="relative border-l border-gray
                        w-full min-h-[40vh] md:min-h-full md:w-[423px] overflow-y-auto"
            >
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
    </>
  );
};

export default PostPage;
