import z from "zod";
import { Button } from "../ui/button";
import { FieldInput } from "../ui/field";
import { InvitationEventFormSchema } from "@/validation/event.validation";
import { Resolver, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";

type InvitationEventInput = z.infer<typeof InvitationEventFormSchema>;

interface Props {
  onSubmit: (data: InvitationEventInput) => void;
}

export default function FormInvitation({ onSubmit }: Props) {
  const form = useForm<InvitationEventInput>({
    resolver: zodResolver(
      InvitationEventFormSchema,
    ) as Resolver<InvitationEventInput>,
    defaultValues: {
      guests: [
        {
          name: "",
          phoneNumber: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "guests", // Matches schema
  });

  const addMoreField = () => {
    if (fields.length >= 10) return;
    append({ name: "", phoneNumber: "" });
  };

  const onSubmitHandler = (data: InvitationEventInput) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmitHandler)}
      className='space-y-4'>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className='flex gap-2 items-end border rounded-lg p-2'>
          <FieldInput
            label='Guest'
            placeholder='Ex : Yono & Yini'
            {...form.register(`guests.${index}.name`)}
            errorMessage={form.formState.errors.guests?.[index]?.name?.message}
          />
          <FieldInput
            label='Phone Number (Whatsapp)'
            type='number'
            placeholder='Ex : 628xxxxxxxxx'
            {...form.register(`guests.${index}.phoneNumber`, {
              required: "Phone number is required",
              maxLength: 14,
            })}
            errorMessage={
              form.formState.errors.guests?.[index]?.phoneNumber?.message
            }
          />
          <Button
            type='button'
            variant={"outline"}
            size={"icon"}
            onClick={() => {
              if (fields.length > 1) {
                remove(index);
              }
            }}>
            <Trash2 />
          </Button>
        </div>
      ))}

      <div className='flex justify-end items-end gap-2'>
        <Button
          type='button'
          variant={"outline"}
          disabled={fields.length >= 10}
          onClick={addMoreField}>
          Add More Guest
        </Button>
        <Button type='submit'>Send Invitation</Button>
      </div>
    </form>
  );
}
