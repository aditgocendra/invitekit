import z from "zod";
import { Button } from "../ui/button";
import { FieldInput } from "../ui/field";
import { InvitationEventFormSchema } from "@/validation/event.validation";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type InvitationEventInput = z.infer<typeof InvitationEventFormSchema>;

interface Props {
  onSubmit: (data: InvitationEventInput) => void;
}

export default function FormInvitation({ onSubmit }: Props) {
  const form = useForm<InvitationEventInput>({
    resolver: zodResolver(
      InvitationEventFormSchema,
    ) as Resolver<InvitationEventInput>,
  });

  const onSubmitHandler = (data: InvitationEventInput) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmitHandler)}
      className='space-y-4'>
      <FieldInput
        label='Guest'
        placeholder='Ex : Yono & Yini'
        {...form.register("name")}
      />

      <FieldInput
        label='Phone Number (Whatsapp)'
        type='number'
        placeholder='Ex : 628xxxxxxxxx'
        {...form.register("phoneNumber")}
      />

      <div className='flex justify-end items-end'>
        <Button type='submit'>Invite</Button>
      </div>
    </form>
  );
}
