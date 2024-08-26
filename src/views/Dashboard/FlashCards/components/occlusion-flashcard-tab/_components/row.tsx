import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from '../../../../../../components/CustomComponents/CustomToast/useCustomToast';
import ApiService from '../../../../../../services/ApiService';
import { BsThreeDots } from 'react-icons/bs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../../../components/ui/dropdown-menu';
import { Input } from '../../../../../../components/ui/input';
import { TableCell, TableRow } from '../../../../../../components/ui/table';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../../../../../../components/ui/alert-dialog';
import { Button } from '../../../../../../components/ui/button';
import { Badge } from '../../../../../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../../../../../../components/ui/dialog';
import { useEffect, useState } from 'react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { cn } from '../../../../../../library/utils';
import { DatePicker } from '../../../../../../components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../../../components/ui/select';
import flashcardStore from '../../../../../../state/flashcardStore';
import { SchedulePayload } from '../../../../../../types';
import { Checkbox } from '../../../../../../components/ui/checkbox';

const DataRow = ({ row, handleOpen, page, limit, checked, handleCheck }) => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();
  const [tagsDialogState, setTagsDialogState] = useState({
    open: false,
    id: ''
  });
  const [scheduleDialog, setScheduleDialog] = useState({
    open: false,
    id: ''
  });

  const { mutate } = useMutation({
    mutationFn: (id: string) => ApiService.deleteOcclusionCard(id),
    onSuccess: async (data) => {
      const res = await data.json();
      console.log('mutationFn', res);
      if (res.message === 'Occlusion card deleted successfully!') {
        queryClient.invalidateQueries({
          queryKey: ['image-occlusions', page, limit]
        });
        toast({
          title: 'Occlusion flashcard deleted',
          status: 'success'
        });
      } else {
        toast({
          title: res.message,
          status: 'error'
        });
      }
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ['image-occlusions', page, limit]
      });

      // Snapshot the previous value
      const previous = queryClient.getQueryData([
        'image-occlusions',
        page,
        limit
      ]);
      queryClient.setQueryData(
        ['image-occlusions', page, limit],
        (old: { data: { _id: string }[] }) => {
          return {
            ...old,
            data: old.data.filter((item) => item._id !== variables)
          };
        }
      );
      return { previous };
    }
  });

  const colorRanges = [
    { max: 100, min: 85.1, color: '#4CAF50', backgroundColor: '#EDF7EE' },
    { max: 85, min: 60, color: '#FB8441', backgroundColor: '#FFEFE6' },
    { max: 59.9, min: 0, color: '#F53535', backgroundColor: '#FEECEC' }
  ];

  function getColorAndBackground(percentage: number) {
    if (isNaN(percentage) || !percentage)
      return {
        color: colorRanges[2].color,
        backgroundColor: colorRanges[2].backgroundColor
      };
    for (const range of colorRanges) {
      if (percentage <= range.max && percentage >= range.min) {
        return { color: range.color, backgroundColor: range.backgroundColor };
      }
    }
    return {
      color: colorRanges[2].color,
      backgroundColor: colorRanges[2].backgroundColor
    };
  }

  return (
    <TableRow key={row._id} className="hover:bg-stone-100 cursor-pointer">
      {/* <TableCell className="text-center w-[50px]">
        <Checkbox checked={checked} onCheckedChange={handleCheck} />
      </TableCell> */}
      <TableCell
        className="font-medium text-[#207DF7] cursor-pointer hover:font-semibold text-center"
        onClick={() => handleOpen(row._id)}
      >
        {row.title}
      </TableCell>
      <TableCell className="text-center">{row.labels.length}</TableCell>
      <TableCell className="text-center">
        <div className="flex flex-wrap gap-2">
          {row.tags.map((tag) => (
            <Badge className="bg-[hsl(240 4.8% 95.9%)] flex items-center justify-center w-fit">
              <div className="w-[16px] h-[16px] mr-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-tag"
                >
                  <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
                  <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
                </svg>
              </div>
              <p>{tag}</p>
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell className="text-center">
        {format(new Date(row.createdAt), 'd-MMMM-yyyy')}
      </TableCell>
      <TableCell className="text-center">
        {format(new Date(row.updatedAt), 'd-MMMM-yyyy')}
      </TableCell>
      <TableCell className="text-center">
        {row.percentages.passPercentage ? (
          <div
            className={`w-fit px-2 py-0.5 rounded bg-[${
              getColorAndBackground(row.percentages.passPercentage)
                .backgroundColor
            }] text-[${
              getColorAndBackground(row.percentages.passPercentage).color
            }]`}
          >
            {row.percentages.passPercentage
              ? Math.floor(row.percentages.passPercentage) + '%'
              : 0 + '%'}
          </div>
        ) : (
          // Not attempted
          <div className="w-fit px-2 py-0.5 rounded bg-[#F3F5F6] text-[#969CA6]">
            Not attempted
          </div>
        )}
      </TableCell>
      <TableCell className="text-right flex justify-end h-full items-center">
        <Dialog>
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <BsThreeDots />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleOpen(row._id)}
                  >
                    <div className="border rounded-full shadow w-6 h-6 flex items-center justify-center mr-2">
                      <svg
                        width="10"
                        height="14"
                        viewBox="0 0 10 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.5835 5.83301H9.66683L4.41683 13.4163V8.16634H0.333496L5.5835 0.583008V5.83301Z"
                          fill="#6E7682"
                        />
                      </svg>
                    </div>
                    Study
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setScheduleDialog({ open: true, id: row._id });
                    }}
                  >
                    <div className="border rounded-full shadow w-6 h-6 flex items-center justify-center mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="12"
                        height="12"
                      >
                        <path
                          fillRule="evenodd"
                          fill="#6E7682"
                          d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    Schedule
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setTagsDialogState({
                        open: true,
                        id: row._id
                      });
                    }}
                  >
                    <div className="border rounded-full shadow w-6 h-6 flex items-center justify-center mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          fill="#6E7682"
                          d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 005.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 00-2.122-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    Edit Tags
                  </DropdownMenuItem>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer">
                      <div className="border rounded-full shadow w-6 h-6 flex items-center justify-center mr-2">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.08317 2.50033V0.750326C3.08317 0.428162 3.34434 0.166992 3.6665 0.166992H8.33317C8.65535 0.166992 8.9165 0.428162 8.9165 0.750326V2.50033H11.8332V3.66699H10.6665V11.2503C10.6665 11.5725 10.4053 11.8337 10.0832 11.8337H1.9165C1.59434 11.8337 1.33317 11.5725 1.33317 11.2503V3.66699H0.166504V2.50033H3.08317ZM4.24984 1.33366V2.50033H7.74984V1.33366H4.24984Z"
                            fill="#F53535"
                          />
                        </svg>
                      </div>
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xs">
                  <p className="text-lg">Are you absolutely sure?</p>
                </AlertDialogTitle>
                <AlertDialogDescription className="text-stone-500">
                  This action cannot be undone. This will permanently delete the
                  occlusion flashcard deck.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-error"
                  onClick={() => {
                    mutate(row._id);
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <EditTagsDialog
            page={page}
            limit={limit}
            row={row}
            open={tagsDialogState.open}
            handleClose={() =>
              setTagsDialogState({ open: false, id: tagsDialogState.id })
            }
          />
        </Dialog>
      </TableCell>
      <ScheduleStudyDialog
        handleClose={() => {
          setScheduleDialog({ open: false, id: '' });
        }}
        open={scheduleDialog.open}
        id={scheduleDialog.id}
      />
    </TableRow>
  );
};

const updateCardTags = (oldData, rowId, tags) => {
  return {
    ...oldData,
    data: oldData.data.map((item) => {
      if (item._id === rowId) {
        return {
          ...item,
          tags: tags
        };
      }
      return item;
    })
  };
};

function createTimeKeyValuePairs() {
  const time = {};
  let hour = 0;
  let minute = 0;

  let loopRunning = true;
  while (loopRunning) {
    // Construct 24-hour format key
    const key = `${hour.toString().padStart(2, '0')}:${minute
      .toString()
      .padStart(2, '0')}`;

    // Determine AM or PM for value
    const amPm = hour >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format for value
    const hour12 = hour % 12 || 12;
    const value = `${hour12.toString().padStart(2, '0')}:${minute
      .toString()
      .padStart(2, '0')} ${amPm}`;

    // Assign the key-value pair
    time[key] = value;

    // Exit the loop if we reach 10:15 PM
    if (hour === 22 && minute === 15) {
      loopRunning = false;
      break;
    }

    // Increment the time by 15 minutes
    minute += 15;
    if (minute === 60) {
      minute = 0;
      hour++;
    }
  }

  return time;
}

function setTimeToMidnight(dateString) {
  const date = new Date(dateString);

  // Set hours and minutes to 0 to get midnight time
  date.setUTCHours(0, 0, 0, 0);

  // Convert back to an ISO string and retain the 'Z' UTC designation
  return date.toISOString();
}

const ScheduleStudyDialog = ({ open, id, handleClose }) => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>('');
  const toast = useCustomToast();
  const { scheduleFlashcard } = flashcardStore();
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: SchedulePayload) =>
      await scheduleFlashcard(payload, true, 'image-occlusion')
  });

  const handleSubmit = () => {
    const dateWithTime = setTimeToMidnight(date);
    const payload = {
      entityId: id,
      entityType: 'occlusionCard',
      startDates: [dateWithTime],
      startTime: time
    };
    mutate(payload, {
      onSuccess() {
        handleClose();
        toast({
          title: 'Study scheduled',
          status: 'success'
        });
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>
            <p className="text-lg">Schedule Study</p>
          </DialogTitle>
        </DialogHeader>
        <hr />
        <div className="flex flex-col gap-4">
          <div className="bg-white flex flex-col">
            <DatePicker onDateChange={setDate} />
          </div>
          <div className="bg-white flex flex-col">
            <Select onValueChange={setTime}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pick a time" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {
                  // Create time key-value pairs
                  Object.entries(createTimeKeyValuePairs()).map(
                    ([key, value]) => (
                      <SelectItem
                        key={key}
                        value={key}
                        className="hover:bg-gray-200"
                      >
                        {value as string}
                      </SelectItem>
                    )
                  )
                }
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end w-full">
            <Button
              disabled={!date || !time || isPending}
              size="sm"
              onClick={handleSubmit}
            >
              {isPending ? <ReloadIcon className="mr-2 animate-spin" /> : null}
              Schedule
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EditTagsDialog = ({ open, handleClose, row, page, limit }) => {
  const queryClient = useQueryClient();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');

  const { isSuccess, data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['occlusion-card', row._id],
    queryFn: () =>
      ApiService.getOcclusionCard(row._id).then((res) => res.json()),
    enabled: Boolean(row._id),
    select: (data) => data.card.tags,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (open) {
      const previous: {
        card: { tags: [] };
      } = queryClient.getQueryData(['occlusion-card', row._id]);
      if (previous.card.tags.join(',') !== tags.join(',')) {
        refetch();
      }
    }
  }, [open]);

  useEffect(() => {
    if (isSuccess) setTags(data);
  }, [isSuccess, isLoading, isFetching]);

  const { mutate, isPending: isSubmittingTags } = useMutation({
    mutationFn: (data: { card: any; percentages: any }) =>
      ApiService.editOcclusionCard(data.card).then((res) => res.json()),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ['image-occlusions', page, limit]
      });

      const previous = queryClient.getQueryData([
        'image-occlusions',
        page,
        limit
      ]);
      queryClient.setQueryData(['image-occlusions', page, limit], (oldData) =>
        updateCardTags(oldData, row._id, tags)
      );

      return { previous };
    }
  });

  const handleAddTag = () => {
    if (!tagInput || tagInput.trim().length === 0) return;
    setTags((prev) => [...prev, tagInput]);
    setTagInput('');
  };

  const handleDeleteTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSave = () => {
    mutate(
      {
        card: {
          ...row,
          tags: tags
        },
        percentages: {}
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['image-occlusions', page, limit]
          });
          handleClose();
          setTags([]);
          setTagInput('');
        }
      }
    );
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader className="text-sm">
          <DialogTitle className="text-sm">
            <p className="text-lg">Edit Tags</p>
          </DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col gap-2">
          <Input
            placeholder="Add a tag and press enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddTag();
            }}
            disabled={isSubmittingTags || isFetching}
          />
          <div className="">
            {isFetching && (
              <p className="text-xs flex gap-2">
                Fetching latest tags in background{' '}
                <ReloadIcon className="animate-spin" />
              </p>
            )}
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag) => (
                <Badge
                  variant="default"
                  className={cn('text-xs', {
                    'cursor-not-allowed opacity-70':
                      isSubmittingTags || isFetching
                  })}
                >
                  {tag}
                  <span
                    onClick={() => handleDeleteTag(tag)}
                    className={cn('ml-2 cursor-pointer', {
                      'pointer-events-none': isSubmittingTags || isFetching
                    })}
                  >
                    &times;
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            size="sm"
            onClick={() => {
              handleClose();
              setTags([]);
              setTagInput('');
            }}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={tags.length === 0 || isFetching || isSubmittingTags}
            onClick={handleSave}
          >
            {isSubmittingTags ? (
              <ReloadIcon className="mr-2 animate-spin" />
            ) : null}
            {isSubmittingTags ? 'Submitting' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DataRow;
