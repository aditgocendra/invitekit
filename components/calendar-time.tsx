import { CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { useState } from "react";
import {
  Controller,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import { PopoverClose } from "@radix-ui/react-popover";

type CalendarTimeExtraProps = {
  label?: string;
};

export type CalendarTimeProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = UseControllerProps<TFieldValues, TName> & CalendarTimeExtraProps;

export default function CalendarTimeCalendarTime<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: CalendarTimeProps<TFieldValues, TName>) {
  const { name, control, label = "Date" } = props;

  const timeSlots = Array.from({ length: 15 }, (_, i) => {
    const totalMinutes = i * 30;
    const hour = Math.floor(totalMinutes / 60) + 8;
    const minute = totalMinutes % 60;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  });

  const [selectedTime, setSelectedTime] = useState<string | null>("10:00");

  const applyTime = (base: Date, hhmm: string): Date => {
    const [hh, mm] = hhmm.split(":").map(Number);
    const d = new Date(base);
    d.setHours(hh, mm, 0, 0);
    return d;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className='w-full flex flex-col'>
          <Label className='text-sm mb-2 font-semibold text-gray-400'>
            {label}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !field.value && "text-muted-foreground",
                )}>
                {field.value ? (
                  `${format(field.value, "PPP")} at ${format(field.value, "HH:mm")}`
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className='w-auto p-0'
              align='start'>
              <Card className='gap-0 p-0'>
                <CardContent className='relative p-0 md:pr-48'>
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={(date) => {
                      if (!date || !selectedTime) return;
                      field.onChange(applyTime(date, selectedTime));
                    }}
                    startMonth={new Date(2020, 0)}
                    endMonth={new Date(2100, 11)}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);

                      return date < today;
                    }}
                    captionLayout='dropdown'
                    className='bg-transparent p-1 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]'
                  />
                  <div className='no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l'>
                    <div className='grid gap-2'>
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={
                            selectedTime === time ? "default" : "outline"
                          }
                          onClick={() => {
                            setSelectedTime(time);
                            const base = field.value ?? new Date();
                            field.onChange(applyTime(base, time));
                          }}
                          className='w-full shadow-none'>
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className='flex flex-col gap-4 border-t px-6 py-5! md:flex-row justify-between'>
                  <div className='text-sm'>
                    {field.value && selectedTime ? (
                      <>
                        Your {label}{" "}
                        <span className='font-medium'>
                          {field.value?.toLocaleDateString("en-US", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}{" "}
                        </span>
                        at <span className='font-medium'>{selectedTime}</span>.
                      </>
                    ) : (
                      <>Select a date and time for your {label}.</>
                    )}
                  </div>
                  <PopoverClose asChild>
                    <Button
                      type='button'
                      disabled={!field.value || !selectedTime}>
                      Close
                    </Button>
                  </PopoverClose>
                </CardFooter>
              </Card>
            </PopoverContent>
          </Popover>
        </div>
      )}></Controller>
  );
}
