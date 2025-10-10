import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useForm, SubmitHandler } from "react-hook-form";
import type { RegisterDataType } from "../../store/types/authTypes.ts";
import { registerUser } from "../../store/actionCreators/authActionCreators.ts";
import {
  FormButton,
  InputForm,
  ErrorFormAlert,
  CustomLink,
  Logo,
} from "../../components/ui/index.ts";

type FormInputs = {
  email: string;
  fullName: string;
  username: string;
  password: string;
};

const RegisterPage = () => {
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
      if (data.username && data.email && data.fullName) {
        const dataRegister: RegisterDataType = {
          username: data.username,
          email: data.email,
          password: data.password,
          fullName: data.fullName,
        };
        const result = await dispatch(registerUser(dataRegister));
        if (result.type === "auth/register/fulfilled") {
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Error during registering:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-col items-center justify-center border border-gray mt-20 px-10 py-10 w-[90%] sm:w-[350px]">
        <Logo />
        <p className="text-darkgray text-center mb-9 mt-4 text-md font-semibold">
          Sign up to see photos and videos from your friends.
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-1.5 text-darkgray w-full"
        >
          <ErrorFormAlert error={error} />

          <InputForm
            name="email"
            register={register}
            placeholder="Email"
            type="email"
            required={true}
            error={errors.email && "Email is required"}
          />
          <InputForm
            name="fullName"
            register={register}
            placeholder="Full Name"
            required={true}
            maxLength={32}
            error={
              errors.fullName && "Full name must be less than 32 characters"
            }
          />
          <InputForm
            name="username"
            register={register}
            placeholder="Username"
            required={true}
            maxLength={24}
            error={
              errors.username && "Username must be less than 24 characters"
            }
          />
          <InputForm
            name="password"
            register={register}
            placeholder="Password"
            type="password"
            required={true}
            minLength={8}
            error={errors.password && "Password must be more than 8 characters"}
          />

          <p className="text-xs mt-2.5 mb-4">
            People who use our service may have uploaded your contact
            information to Instagram.{" "}
            <a className="text-darkblue hover:text-blue transition-all duration-200 cursor-pointer">
              Learn More
            </a>
          </p>
          <p className="text-xs mb-4">
            By signing up, you agree to our{" "}
            <a className="text-darkblue hover:text-blue transition-all duration-200 cursor-pointer">
              Terms
            </a>
            ,{" "}
            <a className="text-darkblue hover:text-blue transition-all duration-200 cursor-pointer">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a className="text-darkblue hover:text-blue transition-all duration-200 cursor-pointer">
              Cookies Policy
            </a>
            .
          </p>
          <FormButton type="submit">Sign up</FormButton>
        </form>
      </div>
      <div className="flex items-center justify-center border border-gray py-[26px] w-[90%] sm:w-[350px] mt-6">
        <p className="text-center">
          Have an account?
          <CustomLink classes="ml-3" to="/login">
            Log in
          </CustomLink>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
