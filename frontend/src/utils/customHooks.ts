import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store.ts";
import { fetchUser } from "../store/actionCreators/userActionCreators.ts";
import { UserState } from "../store/types/userTypes.ts";
import { axiosInstance } from "./apiCalls";
import { AxiosError } from "axios";
import { EmojiClickData } from "emoji-picker-react";
import { createPost } from "../store/actionCreators/postActionCreators.ts";
import { addPost } from "../store/slices/userSlice.ts";

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    const handleChange = () => setMatches(media.matches);
    media.addEventListener("change", handleChange);

    // Установить начальное значение
    setMatches(media.matches);

    return () => media.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
};

export const useFetchUserAfterReload = (user: UserState): void => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    const checkToken = async () => {
      try {
        if (user.username == "") {
          // API call to validate the token
          const { data } = await axiosInstance.get("/auth/check-access-token");
          dispatch(fetchUser({ username: data.username }));
        }
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          // Token is invalid or expired
          navigate("/login", { replace: true }); // Redirect to login
        } else {
          console.error("Unexpected error during auth check:", error);
        }
      }
    };

    checkToken();
  }, [user, dispatch, navigate]);
};

export type PreviewType = {
  url: string;
  width: number;
  height: number;
};

export const useCreatePost = (
  userId: string | null,
  setIsCreatePostOpen: (isOpen: boolean) => void
) => {
  const [content, setContent] = useState<string>("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<PreviewType[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { status, error } = useSelector((state: RootState) => state.post);
  const dispatch = useDispatch<AppDispatch>();

  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      setLocalError("Image should be less than 5MB");
      setPhotos([]);
      setPreviews([]);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/svg+xml",
    ];
    const invalidTypes = files.filter(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidTypes.length > 0) {
      setLocalError("Only JPG, PNG and SVG images are allowed");
      setPhotos([]);
      setPreviews([]);
      return;
    }

    setLocalError(null);

    if (files.length > 0) {
      const fileArray = Array.from(files);
      const previewPromises = fileArray.map((file) => {
        return new Promise<PreviewType>((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onload = () => {
            const img = new Image();
            img.src = reader.result as string;

            img.onload = () => {
              resolve({
                url: reader.result as string,
                width: img.width,
                height: img.height,
              });
            };
          };
        });
      });

      Promise.all(previewPromises).then((previews) => {
        setPreviews(previews);
        setPhotos(fileArray);
      });
    }
  };

  // Handle emoji click
  const onEmojiClick = (emojiData: EmojiClickData) => {
    setContent((prevContent) => prevContent + emojiData.emoji);
  };

  // Reset form state
  const resetForm = () => {
    setContent("");
    setPhotos([]);
    setPreviews([]);
    setLocalError(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (localError) {
      return;
    }

    if (content.length === 0 || photos.length === 0) {
      setLocalError("Please add content and photos before submitting.");
      return;
    }

    setCreating(true);

    try {
      const result = await dispatch(createPost({ photos, content })).unwrap();
      if (result && userId) {
        dispatch(addPost(result));
        setIsCreatePostOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setCreating(false);
    }
  };

  return {
    content,
    setContent,
    photos,
    previews,
    showEmojiPicker,
    setShowEmojiPicker,
    creating,
    status,
    error: localError || error,
    handleFileChange,
    onEmojiClick,
    handleSubmit,
    resetForm,
  };
};

export const useScrollToTop = () => {
  useEffect(() => {
    // Scroll to the top of the page when the component renders
    window.scrollTo({
      top: 0, // Smooth scroll to the top
    });
  }, []); // Empty dependency array ensures it runs only on mount
};
