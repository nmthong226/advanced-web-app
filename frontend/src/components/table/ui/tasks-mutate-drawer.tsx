//Import frameworks
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

//Import components
import { Button } from 'src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'src/components/ui/form';
import { Input } from 'src/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../../ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { SelectDropdown } from 'src/components/ui/select-dropdown';
import ReactQuill from 'react-quill';

//Import icons
import { FaCirclePlus } from "react-icons/fa6";

//Import context
import { useTasksContext } from '../context/task-context'; // Task UI management
import { useTaskContext } from '@/contexts/UserTaskContext.tsx'; // Task data management

//Import packages/libs
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { toast } from "react-toastify";

//Import types
import 'react-quill/dist/quill.snow.css'; // For snow theme
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';

// Validation Schema
const formSchema = z.object({
  _id: z.string().optional(), // Optional _id for updates
  userId: z.string().min(1, 'UserId is required.'), // User ID is required
  title: z.string().min(1, 'Title is required.'), // Title is required
  description: z.string().optional(), // Optional description
  status: z.enum(['pending', 'in-progress', 'completed', 'expired'], {
    errorMap: () => ({ message: 'Select a valid status.' }), // Enum for status
  }),
  priority: z.enum(['high', 'medium', 'low'], {
    errorMap: () => ({ message: 'Select a valid priority.' }), // Enum for priority
  }),
  category: z.string().min(1, 'Category is required.'), // Category is required
  startTime: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val).toISOString() : undefined)), // Optional start time
  endTime: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val).toISOString() : undefined)), // Optional end time
  dueTime: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val).toISOString() : undefined)), // Optional end time
  estimatedTime: z.number().optional(), // Optional estimated time
  pomodoro_required_number: z
    .number()
    .min(0, 'Pomodoro required number should be 0 or greater')
    .optional(), // Optional but can be used for pomodoro number
  pomodoro_number: z
    .number()
    .min(0, 'Pomodoro number should be 0 or greater')
    .optional(), // Optional pomodoro number
  is_on_pomodoro_list: z.boolean().optional(), // Optional but boolean indicating whether it's on the Pomodoro list
  color: z.string().optional(), // Optional style for background and text color
});

type TasksForm = z.infer<typeof formSchema>;

export function TasksMutateDrawer({ start, end }: { start: Date | null; end: Date | null }) {
  const { open, currentRow, handleOpen } = useTasksContext();
  const { setTasks } = useTaskContext();
  const isUpdate = open === 'update';
  const user = useUser();
  // Setup form with React Hook Form and Zod validation
  const form = useForm<TasksForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: user.user?.id,
      title: '',
      description: '',
      status: 'pending',
      priority: 'low',
      category: 'work',
      startTime: start ? start.toISOString() : '',
      endTime: end ? end.toISOString() : '',
      estimatedTime: 30, // Default value for estimated time
      pomodoro_required_number: 0,
      pomodoro_number: 0,
      is_on_pomodoro_list: false,
      color: '#ffffff',
    },
  });

  // Reset form with currentRow data when updating
  useEffect(() => {
    if (isUpdate && currentRow) {
      form.reset({
        _id: currentRow._id,
        userId: currentRow.userId,
        title: currentRow.title,
        description: currentRow.description || '',
        status: currentRow.status,
        priority: currentRow.priority,
        category: currentRow.category,
        startTime: currentRow.startTime || '',
        endTime: currentRow.endTime || '',
        dueTime: currentRow.dueTime || '',
        estimatedTime: currentRow.estimatedTime,
        pomodoro_required_number: currentRow.pomodoro_required_number || 0,
        pomodoro_number: currentRow.pomodoro_number || 0,
        is_on_pomodoro_list: currentRow.is_on_pomodoro_list || false,
        color: currentRow.color || '#ffffff',
      });
    } else {
      // Reset form to default values in create mode
      form.reset({
        userId: user.user?.id,
        title: '',
        description: '',
        status: 'pending',
        priority: 'low',
        category: 'work',
        startTime: '',
        endTime: '',
        dueTime: '',
        estimatedTime: undefined,
        pomodoro_required_number: 0,
        pomodoro_number: 0,
        is_on_pomodoro_list: false,
        color: '',
      });
    }
  }, [currentRow, isUpdate]);


  const onSubmit = async (data: TasksForm) => {
    try {
      // Transform _id to id for backend compatibility
      const payload = {
        ...data,
        id: data._id || `TASK-${Date.now()}`,
      };
      delete payload._id; // Remove _id field to avoid conflicts

      if (isUpdate) {
        await axios.patch(
          `${import.meta.env.VITE_BACKEND}/tasks/${data._id}`,
          payload,
        );
        setTasks((prev) =>
          prev.map((task) =>
            task._id === data._id ? { ...task, ...payload } : task,
          ),
        );
        toast.success(
          <p className='text-sm'>
            Your task has been successfully updated.
          </p>
        );
      } else {
        console.log(payload);
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND}/tasks`,
          payload,
        );
        setTasks((prev) => [...prev, response.data]);
        toast.success(
          <p className='text-sm'>
            Your task has been successfully created.
          </p>
        );
      }

      handleOpen(null);
      form.reset();
    } catch (error) {
      console.error('Error submitting task:', error);
      toast.error(
        <p className='text-sm'>
          Failed to save the task. Please try again later.
        </p>
      );
    }
  };

  const [isDisabled] = useState(true);

  // const handleToggle = (value: any) => {
  //   setIsDisabled(!value); // Toggle the disabled state
  //   if (!value) {
  //     // Reset the form fields when switching to disabled
  //     form.reset({
  //       startTime: '', // Default or initial values
  //       endTime: '',
  //       estimatedTime: 0,
  //     });
  //   }
  // };

  useEffect(() => {
    if (start && end) {
      const timezoneOffsetInMinutes = start.getTimezoneOffset();

      // Adjust start and end times to local time
      const localStart = new Date(start.getTime() - timezoneOffsetInMinutes * 60000);
      const localEnd = new Date(end.getTime() - timezoneOffsetInMinutes * 60000);

      // Set adjusted values in the form
      form.setValue('startTime', localStart.toISOString());
      form.setValue('endTime', localEnd.toISOString());
    }
  }, [start, end, form]);

  return (
    <>
      <Dialog open={open === 'create' || open === 'update'} onOpenChange={(v) => {
        if (!v) {
          handleOpen(null); // Close dialog when toggled off
          form.reset();
        }

      }}>
        <DialogContent className="flex flex-col custom-scrollbar min-w-[640px] max-h-[100vh] overflow-y-auto [&>button]:hidden" bgOverlay='bg-black/20'>
          <DialogHeader>
            <DialogTitle className='font-bold text-indigo-800 text-lg'>{isUpdate ? 'Update' : 'Create'} Task</DialogTitle>
            <DialogDescription className='text-[12px] text-muted-foreground'>
              {isUpdate
                ? 'Update the task by providing the necessary info. '
                : 'Add a new task by providing the necessary info. '}
              Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              id="tasks-form"
              onSubmit={form.handleSubmit(
                (data) => {
                  console.log('Form successfully submitted with data:', data); // Should log if no errors
                  onSubmit(data);
                },
                (errors) => {
                  console.error('Validation errors:', errors); // Debug validation errors
                },
              )}
              className="flex flex-col">
              <div className="flex items-center mb-2 w-full">
                {/* Button to Toggle Date Fields */}
                <button
                  type="button"
                  // onClick={() => handleToggle(isDisabled)}
                  className="flex justify-center items-center space-x-2 bg-zinc-200 px-2 rounded-md w-16 h-8 text-center"
                >
                  <p className="flex-nowrap text-[12px] text-nowrap text-zinc-800">
                    {isDisabled ? "No dates" : "From/To"}
                  </p>
                </button>
                <span className={`mx-2 ${isDisabled ? 'invisible' : ''}`}>|</span>
                {/* Conditional Rendering of Date Fields */}
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem className={`flex space-x-2 space-y-0 mr-4`}>
                      <FormLabel className="flex items-center space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger disabled className="items-center">
                              <p className="font-normal text-muted-foreground">Start:</p>
                            </TooltipTrigger>
                            <TooltipContent>Your time to start this task.</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="datetime-local"
                          value={field.value ? field.value.slice(0, 16) : ""}
                          onChange={(e) => {
                            const inputValue = e.target.value; // Local datetime format
                            const localDateTime = new Date(inputValue); // Parse local datetime
                            const timezoneOffsetInMinutes = localDateTime.getTimezoneOffset(); // Get timezone offset
                            const adjustedLocalTime = new Date(
                              localDateTime.getTime() - timezoneOffsetInMinutes * 60000 // Adjust for local timezone
                            ).toISOString();
                            field.onChange(adjustedLocalTime); // Save ISO string with adjustment
                          }}
                          className="bg-white w-52 md:text-[12px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* End Date Field */}
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem className={`flex space-x-2 space-y-0 mr-4`}>
                      <FormLabel className="flex items-center space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger disabled>
                              <p className="font-normal text-muted-foreground">End:</p>
                            </TooltipTrigger>
                            <TooltipContent>
                              Your time to end this task before or at the due date.
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="datetime-local"
                          value={field.value ? field.value.slice(0, 16) : ""}
                          onChange={(e) => {
                            const inputValue = e.target.value; // Local datetime format
                            const vnLocalDate = new Date(inputValue); // Parse local date
                            const offsetInMs = 7 * 60 * 60 * 1000; // UTC+7 offset
                            const localTime = new Date(
                              vnLocalDate.getTime() + offsetInMs
                            ).toISOString();
                            field.onChange(localTime); // Update the form's state
                          }}
                          onBlur={() => {
                            form.trigger("endTime"); // Ensure validation is triggered on blur
                          }}
                          className="bg-white w-52 md:text-[12px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Title Field */}
              <div className='flex justify-between w-full'>
                <div className='flex flex-col space-y-4 w-full'>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter a title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Task Description Field */}
                  <div>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <ReactQuill
                              theme="snow"
                              value={field.value || ''}
                              onChange={field.onChange}
                              placeholder="Write the task description..."
                              className="bg-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='flex flex-row space-x-2'>
                    {/* Status Field */}
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0 bg-white pl-2 border rounded-md h-10">
                          <SelectDropdown
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select status"
                            items={[
                              { label: 'Pending', value: 'pending' },
                              { label: 'In Progress', value: 'in-progress' },
                              { label: 'Completed', value: 'completed' },
                              { label: 'Expired', value: 'expired' },
                            ]}
                            className='border-0 shadow-none px-1 text-[12px]'
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Priority Field */}
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0 bg-white pl-2 border rounded-md h-10">
                          <SelectDropdown
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select priority"
                            items={[
                              { label: 'High', value: 'high' },
                              { label: 'Medium', value: 'medium' },
                              { label: 'Low', value: 'low' },
                            ]}
                            className='border-0 shadow-none px-1 text-[12px]'
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Category Field */}
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0 bg-white pl-2 border rounded-md h-10">
                          <SelectDropdown
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select category"
                            items={[
                              { label: 'Work', value: 'work' },
                              { label: 'Leisure', value: 'leisure' },
                              { label: 'Personal', value: 'personal' },
                              { label: 'Urgent', value: 'urgent' },
                            ]}
                            className='border-0 shadow-none px-1 text-[12px]'
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Due Date Field */}
                    <FormField
                      control={form.control}
                      name="dueTime"
                      render={({ field }) => {
                        const [isEditing, setIsEditing] = useState(false);

                        return (
                          <FormItem className="flex items-center space-x-2 space-y-0 bg-white px-2 border rounded-md h-10">
                            <FormLabel className="text-[12px]">
                              <p>Due:</p>
                            </FormLabel>
                            <FormControl>
                              {isEditing || field.value ? (
                                <Input
                                  {...field}
                                  type="datetime-local"
                                  value={field.value ? field.value.slice(0, 16) : ''}
                                  onChange={(e) => {
                                    const inputValue = e.target.value; // Local datetime format
                                    const vnLocalDate = new Date(inputValue); // Parse it as local date
                                    const offsetInMs = 7 * 60 * 60 * 1000; // UTC+7 offset
                                    const localTime = new Date(vnLocalDate.getTime() + offsetInMs).toISOString();
                                    field.onChange(localTime); // Save the local time string
                                  }}
                                  className="border-0 shadow-none px-1 md:text-[12px]"
                                  onBlur={() => !field.value && setIsEditing(false)} // Exit edit mode if no value
                                />
                              ) : (
                                <div
                                  className="px-1 text-gray-500 md:text-[12px] cursor-pointer"
                                  onClick={() => setIsEditing(true)}
                                >
                                  No due date
                                </div>
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </form>
          </Form>
          <div className="flex justify-end gap-2 mt-4">
            <DialogTrigger asChild>
              <Button variant="outline">Close</Button>
            </DialogTrigger>
            <Button form="tasks-form" type="submit" className='items-center bg-indigo-800'>
              <FaCirclePlus className='' />
              Create Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
