import { useNavigate } from "react-router";
import { login as loginBG } from "../../assets/bg_deco_imgs/index.ts";

import {
  InputForm,
  FormButton,
  ErrorFormAlert,
  CustomLink,
  Logo,
} from "../../components/ui/index.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useForm, SubmitHandler } from "react-hook-form";
import type { LoginDataType } from "../../store/types/authTypes.ts";
import { userLogin } from "../../store/actionCreators/authActionCreators.ts";

type FormInputs = {
  usernameOrEmail: string;
  password: string;
};

const LoginPage = () => {
  const { error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      if (data.usernameOrEmail) {
        const dataLogin: LoginDataType = {
          usernameOrEmail: data.usernameOrEmail,
          password: data.password,
        };
        const result = await dispatch(userLogin(dataLogin));
        if (result.type === "auth/login/fulfilled") {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex gap-8 mt-20">
        <img
          className="hidden lg:block"
          src={loginBG}
          alt="Ichgram screenshot"
        />
        <div>
          <div className="flex flex-col items-center justify-center border border-gray px-10 py-6 w-full sm:w-[350px] h-fit">
            <Logo classes="my-6" />
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
              <InputForm
                name="password"
                register={register}
                placeholder="Password"
                type="password"
                required={true}
                minLength={8}
                error={
                  errors.password && "Password must be more than 8 characters"
                }
              />
              <FormButton type="submit">Log in</FormButton>
            </form>
            <div className="flex gap-4 justify-center items-center text-gray mb-[70px] mt-4">
              <p>__________</p>
              <p className="pt-3.5 text-xs text-darkgray transition-smooth">
                OR
              </p>
              <p>__________</p>
            </div>
            <CustomLink to="/reset" classes="text-sm">
              Forgot password?
            </CustomLink>
          </div>
          <div className="flex items-center justify-center border border-gray py-[26px] mt-2.5 w-full sm:w-[350px]">
            <p className="text-center">
              Don't have an account?
              <CustomLink to="/register" classes="ml-4">
                Sign up
              </CustomLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
