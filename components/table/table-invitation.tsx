"use client";
import {
  ArrowUpDown,
  Check,
  CheckCircleIcon,
  Link,
  MoreVertical,
  RefreshCcw,
  RotateCw,
  TimerIcon,
  Trash,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Pagination from "../pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { InvitationDTO, SentStatusType } from "@/types/rsvp";
import { DialogInvitation } from "../dialog/dialog-invitation";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import SearchInput from "../search-input";
import { DialogConfirmation } from "../dialog/dialog-confirmation";
import { useState } from "react";
import { useLoading } from "@/hooks/use-loading";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";

interface TableInvitationProps {
  data?: InvitationDTO[];
  totalPages: number;
}

export default function TableInvitation({
  data,
  totalPages,
}: TableInvitationProps) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace, refresh } = useRouter();
  const { withLoading } = useLoading();

  // Dialog State
  const [dialogDelete, setDialogDelete] = useState(false);

  const handleDialogDelete = () => {
    if (dialogDelete) {
      setDialogDelete(false);
    } else {
      setDialogDelete(true);
    }
  };

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;

    await withLoading(async () => {
      const res = await fetch(`/api/event/invitation`, {
        credentials: "include",
        method: "DELETE",
        body: JSON.stringify({ ids: selectedIds }),
      });

      const json = await res.json();

      toast("Delete Invitation", {
        duration: 3000,
        position: "top-center",
        description: json.message,
        richColors: true,
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });

      if (res.ok) {
        refresh();
        setSelectedIds([]);
      }
    });
  };

  const handleChangeLimit = (value: number) => {
    params.set("limit", value.toString());
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSort = ({ sortBy }: { sortBy: string }) => {
    const sort = params.get("sort");

    if (sort === "asc" || sort === null) {
      params.set("sort", "desc");
    } else {
      params.set("sort", "asc");
    }

    params.set("sortBy", sortBy);

    replace(`${pathname}?${params.toString()}`);
  };

  const reInvite = async (id: string) => {
    await withLoading(async () => {
      const res = await fetch(`/api/event/invitation/re?invitationId=${id}`, {
        credentials: "include",
        method: "POST",
      });

      if (res.ok) {
        refresh();
      }
    });
  };

  return (
    <div className='flex flex-col gap-4 border border-border rounded-xl p-4'>
      <DialogConfirmation
        title='Delete Invitation'
        desc='Are you sure delete this invitation ? This action cannot be undone, and guest will not be able to RSVP.'
        open={dialogDelete}
        setOpen={handleDialogDelete}
        onDelete={handleDelete}
        onClose={() => {
          setSelectedIds([]);
        }}
      />

      {/* Header */}
      <div className='flex justify-between items-center gap-2'>
        <div className='flex items-center gap-2'>
          <SearchInput
            onSearch={(search) => {
              params.set("search", search);
              replace(`${pathname}?${params.toString()}`);
            }}
            onReset={() => {
              params.delete("search");
              replace(`${pathname}?${params.toString()}`);
            }}
          />

          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              params.delete("search");
              params.delete("sort");
              params.delete("sortBy");
              replace(`${pathname}?${params.toString()}`);
            }}>
            <RotateCw className='mx-1' />
            <span className='hidden lg:inline'>Reset</span>
          </Button>
        </div>

        <DialogInvitation eventId={params.get("id") as string} />
      </div>

      {/* Action Button */}
      <div
        className={`${selectedIds.length === 0 || dialogDelete ? "hidden" : "flex"}  items-center justify-between bg-card rounded-lg p-2.5 shadow-card border border-border`}>
        <p className='texdt-sm'>{selectedIds.length} Invitation selected</p>
        <div className='flex gap-2'>
          <Button
            size='sm'
            variant='destructive'
            onClick={handleDialogDelete}>
            <Trash2 className='mx-1' />
            <span className='hidden lg:inline'>Delete</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className='border rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-center'>
                <Checkbox
                  checked={
                    selectedIds.length === data?.length &&
                    selectedIds.length > 0
                  }
                  onCheckedChange={(b) => {
                    if (b) {
                      setSelectedIds(data?.map((d) => d.id) as string[]);
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>
                <div className='flex items-center'>
                  Guest
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleSort({ sortBy: "name" })}>
                    <ArrowUpDown />
                  </Button>
                </div>
              </TableHead>
              <TableHead>
                <div className='flex items-center'>
                  Phone (Whatsapp)
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleSort({ sortBy: "phone" })}>
                    <ArrowUpDown />
                  </Button>
                </div>
              </TableHead>
              <TableHead>
                <div className='flex items-center'>
                  Sent Status
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleSort({ sortBy: "sentStatus" })}>
                    <ArrowUpDown />
                  </Button>
                </div>
              </TableHead>
              <TableHead>Opened At</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead className='text-end'></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className='text-center'>
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={(b) => {
                      if (b) {
                        setSelectedIds((prev) => [...prev, item.id]);
                      } else {
                        setSelectedIds((prev) =>
                          prev.filter((id) => id !== item.id),
                        );
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.phone}</TableCell>

                <TableCell>
                  <Badge
                    variant={"outline"}
                    className='flex items-center font-normal gap-2 text-gray-500'>
                    {item.sentStatus === SentStatusType.SUCCESS ? (
                      <CheckCircleIcon className='text-green-700' />
                    ) : item.sentStatus === SentStatusType.PENDING ? (
                      <TimerIcon className='text-yellow-500' />
                    ) : (
                      <X className='text-red-500' />
                    )}
                    {item.sentStatus[0].toUpperCase() +
                      item.sentStatus.slice(1).toLowerCase()}
                  </Badge>
                </TableCell>

                <TableCell>
                  {item.openedAt ? (
                    format(item.openedAt, "dd/MM/yyyy")
                  ) : (
                    <span>Wait...</span>
                  )}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={"outline"}
                    className='flex items-center font-normal gap-2 text-gray-500'>
                    {item.rsvp ? (
                      item.rsvp.isAttendance ? (
                        <Check className='text-green-700' />
                      ) : (
                        <X className='text-red-500' />
                      )
                    ) : (
                      <TimerIcon className='text-yellow-500' />
                    )}
                    {!item.rsvp
                      ? "Waiting"
                      : item.rsvp.isAttendance
                        ? "Yes"
                        : "No"}
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className='flex justify-end gap-2'>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical
                          size={16}
                          className='m-1'
                        />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        className='text-sm'
                        align='start'>
                        <DropdownMenuItem onClick={() => reInvite(item.id)}>
                          <RefreshCcw className='mr-1' /> Resend Invitation
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            const url = `${process.env.NEXT_PUBLIC_APP_URL}/i/${item.slug}`;
                            navigator.clipboard.writeText(url).then(() => {
                              toast("Link copied to clipboard");
                            });
                          }}>
                          <Link className='mr-1' /> Copy Link
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className='text-red-600'
                          onClick={() => {
                            setSelectedIds([...selectedIds, item.id]);
                            handleDialogDelete();
                          }}>
                          <Trash className='text-red-600 mr-1' />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='flex justify-end items-center py-4 px-4'>
        <Pagination
          totalPages={totalPages}
          pageParam='page'
        />

        <Select onValueChange={(value) => handleChangeLimit(parseInt(value))}>
          <SelectTrigger>
            <SelectValue placeholder='10 / Page' />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value='10'>10 / Page</SelectItem>
            <SelectItem value='25'>25 / Page</SelectItem>
            <SelectItem value='50'>50 / Page</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
