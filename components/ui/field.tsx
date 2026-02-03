import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "./textarea";

interface InputFormProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errorMessage?: string;
}

export function FieldInput({ label, errorMessage, ...props }: InputFormProps) {
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

interface FieldTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  errorMessage?: string;
}

export function FieldTextArea({
  label,
  errorMessage,
  ...props
}: FieldTextAreaProps) {
  return (
    <div>
      <Label
        htmlFor={label}
        className='text-sm text-gray-400 font-semibold mb-1.5'>
        {label}
      </Label>
      <Textarea {...props} />

      <p
        className={`${
          errorMessage ? "block" : "hidden"
        } text-xs text-red-500 font-semibold m-1 rounded-sm`}>
        {errorMessage}
      </p>
    </div>
  );
}
