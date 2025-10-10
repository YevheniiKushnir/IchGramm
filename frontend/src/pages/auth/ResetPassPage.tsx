import { Link, useNavigate } from "react-router";
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
import type { ResetDataType } from "../../store/types/authTypes.ts";
import { resetPassword } from "../../store/actionCreators/authActionCreators.ts";

type FormInputs = {
  usernameOrEmail: string;
};

const ResetPassPage = () => {
  const { error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (data.usernameOrEmail) {
      const dataReset: ResetDataType = {
        usernameOrEmail: data.usernameOrEmail,
      };
      const result = await dispatch(resetPassword(dataReset));
      if (result.type === "auth/reset/fulfilled") {
        navigate("/login");
      }
    }
  };
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
            Trouble logging in?
          </p>
          <p className="text-darkgray text-center mb-3 mt-3 text-sm">
            Enter your email, phone, or username and we'll send you a link to
            get back into your account.
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-1.5 text-darkgray w-full"
          >
            <ErrorFormAlert error={error} />

            <InputForm
              name="usernameOrEmail"
              register={register}
              placeholder="Email or Username"
              type="text"
              required={true}
              error={
                errors.usernameOrEmail?.type === "required"
                  ? "Email or Username is required"
                  : errors.usernameOrEmail?.type === "maxLength"
                  ? "Must be less than 24 characters"
                  : undefined
              }
              maxLength={24}
            />
            <FormButton type="submit">Reset your password</FormButton>
          </form>
          <div className="flex gap-4 justify-center items-center text-gray mt-12 mb-4">
            <p>__________</p>
            <p className="pt-3.5 text-xs text-darkgray">OR</p>
            <p>__________</p>
          </div>
          <Link
            className="text-sm mb-12 font-semibold hover:text-blue transition-all duration-200"
            to="/register"
          >
            Create new account
          </Link>
        </div>
        <div className="w-full sm:w-[390px] border border-gray bg-decobackground border-t-0 flex items-center justify-center py-4">
          <Link
            className="text-sm font-semibold hover:text-blue transition-all duration-200 w-full text-center"
            to="/login"
          >
            Back to login
          </Link>
        </div>
      </div>
    </>
  );
};

export default ResetPassPage;
