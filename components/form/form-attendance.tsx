import z from "zod";
import { Button } from "../ui/button";
import { FieldTextArea } from "../ui/field";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "../ui/checkbox";
import { RsvpFormSchema } from "@/validation/rsvp.validation";

type RsvpEventInput = z.infer<typeof RsvpFormSchema>;

interface Props {
  defaultValues?: Partial<RsvpEventInput>;
  onSubmit: (data: RsvpEventInput) => void;
}

export default function FormAttendance({ defaultValues, onSubmit }: Props) {
  const form = useForm<RsvpEventInput>({
    defaultValues,
    resolver: zodResolver(RsvpFormSchema) as Resolver<RsvpEventInput>,
  });

  const onSubmitHandler = (data: RsvpEventInput) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmitHandler)}
      className='space-y-4'>
      <input
        type='text'
        className='hidden'
        {...form.register("invitationId")}
      />
      <div className='flex justify-between items-center p-2.5 border rounded-lg'>
        <div>
          <span className='font-semibold text-sm'>Attendance ?</span>

          <p className='text-gray-400 text-xs'>
            Please check the above to confirm your attendance
          </p>
        </div>
        <Checkbox
          defaultChecked={defaultValues?.attendance}
          {...form.register("attendance")}
        />
      </div>

      <FieldTextArea
        label='Message (Optional)'
        placeholder='Please leave a message...'
        {...form.register("message")}
      />

      <div className='flex justify-end items-end'>
        <Button type='submit'>Send</Button>
      </div>
    </form>
  );
}
