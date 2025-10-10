import { useNavigate, useParams } from "react-router";
import { lock } from "../../assets/bg_deco_imgs/index.ts";
import {
  InputForm,
  FormButton,
  ErrorFormAlert,
  Logo,
} from "../../components/ui/index.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useForm, SubmitHandler } from "react-hook-form";
import { confirmPasswordReset } from "../../store/actionCreators/authActionCreators.ts";
import { Link } from "react-router";

type FormInputs = {
  newPassword: string;
  confirmPassword: string;
};

const ResetConfirmPage = () => {
  const { token } = useParams<{ token: string }>();
  const { error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (token) {
      const result = await dispatch(
        confirmPasswordReset({
          token,
          newPassword: data.newPassword,
        })
      );
      if (result.type === "auth/confirmReset/fulfilled") {
        navigate("/login");
      }
    }
  };

  const password = watch("newPassword");

  return (
    <>
      <Link to="/login">
        <Logo classes="w-[97px] mx-11 my-5" />
      </Link>
      <hr className="text-gray" />
      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-full sm:w-[390px] border border-gray flex flex-col items-center justify-center mt-[84px] px-10 py-10">
          <img src={lock} alt="Lock" className="dark:invert" />
          <p className="font-semibold text-center mt-3.5">
            Create new password
          </p>
          <p className="text-darkgray text-center mb-3 mt-3 text-sm">
            Your new password must be different from previous used passwords.
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-1.5 text-darkgray w-full"
          >
            <ErrorFormAlert error={error} />

            <InputForm
              name="newPassword"
              register={register}
              placeholder="New password"
              type="password"
              required={true}
              error={
                errors.newPassword?.type === "required"
                  ? "Password is required"
                  : errors.newPassword?.type === "minLength"
                  ? "Password must be at least 6 characters"
                  : undefined
              }
              minLength={6}
            />

            <InputForm
              name="confirmPassword"
              register={register}
              placeholder="Confirm password"
              type="password"
              required={true}
              validate={(value) =>
                value === password || "Passwords do not match"
              }
              error={errors.confirmPassword?.message}
            />

            <FormButton type="submit">Reset password</FormButton>
          </form>
          <div className="flex gap-4 justify-center items-center text-gray mt-12 mb-4">
            <p>__________</p>
            <p className="pt-3.5 text-xs text-darkgray">OR</p>
            <p>__________</p>
          </div>
          <Link
            className="text-sm mb-12 font-semibold hover:text-blue transition-all duration-200"
            to="/login"
          >
            Back to login
          </Link>
        </div>
      </div>
    </>
  );
};

export default ResetConfirmPage;
