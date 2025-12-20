import { InputHTMLAttributes } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface InputFormProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errorMessage?: string;
}

export default function FieldInput({
  label,
  errorMessage,
  ...props
}: InputFormProps) {
  return (
    <div className='w-full flex flex-col'>
      <Label
        htmlFor={label}
        className='text-sm text-muted-foreground font-semibold mb-1.5'>
        {label}
      </Label>
      <Input {...props} />
      <p
        className={`${
          errorMessage ? "block" : "hidden"
        } text-xs text-red-500 font-semibold m-1 rounded-sm`}>
        {errorMessage}
      </p>
    </div>
  );
}
