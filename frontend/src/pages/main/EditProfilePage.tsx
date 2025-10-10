import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { webLink } from "../../assets/general_icons/index.ts";
import {
  editProfile,
  fetchUser,
} from "../../store/actionCreators/userActionCreators.ts";
import { useNavigate } from "react-router";

interface FormInputs {
  username: string;
  website: string;
  about: string;
  profileImage: File[] | null;
}

const EditProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isDirty },
  } = useForm<FormInputs>({
    defaultValues: {
      username: user?.username || "",
      website: user?.website || "",
      about: user?.bio || "",
      profileImage: null,
    },
  });

  const [preview, setPreview] = useState<string | null>(
    user?.profile_image || null
  );
  const [showNotification, setShowNotification] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File must be smaller than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      console.log(e.target.files);
      setValue("profileImage", [file], {
        shouldValidate: true,
        shouldDirty: true,
      });
      await trigger("profileImage");
    }
  };

  const onSubmit = async (data: FormInputs) => {
    try {
      const result = await dispatch(
        editProfile({
          username: user.username,
          new_username: data.username,
          profile_image: data.profileImage,
          website: data.website,
          bio: data.about,
        })
      );
      if (result.type === "user/editProfile/fulfilled") {
        await dispatch(fetchUser({ username: data.username }));
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
          navigate(`/profile/${data.username}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to edit profile: ", error);
    }
  };

  return (
    <form
      className="flex flex-col mx-auto my-9 max-w-[610px]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="font-semibold text-xl mb-11">Edit profile</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 p-4 bg-gray rounded-[20px]">
        <div className="flex gap-4">
          <img
            src={preview || user.profile_image}
            alt={user.username}
            className="w-14 h-14 object-cover rounded-[50%] border border-[#00000019]"
          />
          <div>
            <p className="font-semibold mb-2">{user.username}</p>
            <p className="w-[210px] sm:w-[265px] break-words line-clamp-2">
              {user.bio}
            </p>
          </div>
        </div>
        <input
          {...register("profileImage")}
          type="file"
          style={{ display: "none" }}
          id="file-upload"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileChange(e)}
        />
        <label
          htmlFor="file-upload"
          className="text-background bg-blue h-fit rounded-lg px-4 py-2 cursor-pointer"
        >
          New photo
        </label>
      </div>
      <p className="font-semibold mb-2">Username</p>
      {user.error && <p className="pt-2 text-xs text-error">{user.error}</p>}
      <input
        {...register("username", {
          required: "Username is required",
          maxLength: 120,
        })}
        className="border border-gray rounded-xl mb-5 h-10 px-4 bg-decobackground text-text"
      />
      {errors.username && (
        <p className="pt-2 text-xs text-error">{errors.username.message}</p>
      )}

      <div className="relative flex flex-col">
        <p className="font-semibold mb-2">Website</p>
        <input
          {...register("website", { maxLength: 120 })}
          className="border border-gray rounded-xl mb-5 h-10 pr-4 pl-8 text-darkblue bg-decobackground"
        />
        <img src={webLink} alt="Website" className="absolute bottom-8 left-4" />
        {errors.website && (
          <p className="pt-2 text-xs text-error">{errors.website.message}</p>
        )}
      </div>

      <p className="font-semibold mb-2">About</p>
      <div className="relative h-16 mb-16 w-full">
        <textarea
          {...register("about", { maxLength: 150 })}
          className="border border-gray z-0 rounded-xl h-16
            w-full pl-4 pr-20 py-1 overflow-y-scroll resize-none text-text bg-decobackground"
        />
        <p className="absolute bottom-2 right-3 text-darkgray text-xs">
          {watch("about").length}/150
        </p>
      </div>
      {errors.about && (
        <p className="pt-2 text-xs text-error">{errors.about.message}</p>
      )}

      <button
        type="submit"
        className={`${
          isDirty ? "bg-blue" : "bg-gray cursor-not-allowed"
        } text-background py-2 w-full sm:w-[268px] rounded-lg text-sm`}
        disabled={!isDirty}
      >
        Save
      </button>

      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-blue text-background px-4 py-2 rounded shadow-md flex items-center gap-2">
          <span>Profile edited</span>
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
    </form>
  );
};

export default EditProfilePage;
