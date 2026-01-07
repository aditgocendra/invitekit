import { cva } from "class-variance-authority";
import { HTMLAttributes } from "react";
import { BadgeCheck, CircleAlert, CircleX, InfoIcon } from "lucide-react";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

const alertVariants = cva("rounded-lg p-4", {
  variants: {
    variant: {
      success: "text-green-400 border-green-200 bg-green-50",
      error: "text-red-400 border-red-200 bg-red-50",
      warning: "text-yellow-400 border-yellow-200 bg-yellow-50",
      info: "text-blue-400 border-blue-200 bg-blue-50",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

export const Alert = ({
  type = "info",
  title,
  message,
  className,
  ...props
}: AlertProps) => {
  return (
    <div
      className={alertVariants({ variant: type, className })}
      role='alert'
      aria-labelledby='hs-with-description-label'
      {...props}>
      <div className='flex gap-3'>
        {type === "success" ? (
          <BadgeCheck size={20} />
        ) : type === "error" ? (
          <CircleX size={20} />
        ) : type === "warning" ? (
          <CircleAlert />
        ) : (
          <InfoIcon />
        )}

        <div className=''>
          <h3 className='text-sm font-bold'>{title}</h3>
          <p className='mt-1 text-xs font-semibold'>{message}</p>
        </div>
      </div>
    </div>
  );
};
