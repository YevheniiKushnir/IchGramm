import React from "react";
import { UseFormRegister, RegisterOptions } from "react-hook-form";

interface InputProps {
  name: string;
  register: UseFormRegister<any>;
  placeholder: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  error?: string;
  validate?: RegisterOptions["validate"];
}

const InputForm: React.FC<InputProps> = ({
  name,
  register,
  placeholder,
  type = "text",
  required = false,
  maxLength,
  minLength,
  error,
  validate,
}) => {
  return (
    <>
      <input
        {...register(name, { required, maxLength, minLength, validate })}
        type={type}
        placeholder={placeholder}
        className="bg-decobackground border border-gray h-[38px] rounded-sm pl-2 font-xs text-text placeholder:text-darkgray outline-none"
      />
      {error && <span className="text-error text-xs">{error}</span>}
    </>
  );
};

export default InputForm;
