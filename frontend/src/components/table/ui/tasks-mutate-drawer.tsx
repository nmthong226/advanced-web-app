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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { SelectDropdown } from 'src/components/ui/select-dropdown';
import { Switch } from '../../ui/switch';

//Import icons
import { LuInfo } from "react-icons/lu";

//Import context
import { useTasksContext } from '../context/task-context'; // Task UI management
import { useTaskContext } from '@/contexts/UserTaskContext.tsx'; // Task data management

//Import packages/libs
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { toast } from "react-toastify";

// Validation Schema
// New Validation Schema
const formSchema = z.object({
  _id: z.string().optional(),
  userId: z.string().min(1, 'UserId is required.'),
  title: z.string().min(1, 'Title is required.'),
  description: z.string().optional(),
  status: z.enum(['pending', 'in-progress', 'completed', 'expired'], {
    errorMap: () => ({ message: 'Select a valid status.' }),
  }),
  priority: z.enum(['high', 'medium', 'low'], {
    errorMap: () => ({ message: 'Select a valid priority.' }),
  }),
  category: z.string().min(1, 'Category is required.'),
  startTime: z
    .string()
    .datetime()
    .optional()
    .transform((val) => (val ? new Date(val).toISOString() : undefined)),
  endTime: z
    .string()
    .datetime()
    .optional()
    .transform((val) => (val ? new Date(val).toISOString() : undefined)),
  dueTime: z
    .string()
    .datetime()
    .optional()
    .transform((val) => (val ? new Date(val).toISOString() : undefined)),
  estimatedTime: z.number().optional(),
  style: z
    .object({
      backgroundColor: z.string(),
      textColor: z.string(),
    })
    .optional(),
});

type TasksForm = z.infer<typeof formSchema>;

export function TasksMutateDrawer() {
  const { open, currentRow, handleOpen } = useTasksContext();
  const [isDisabled, setIsDisabled] = useState(true);
  const { setTasks } = useTaskContext();
  const isUpdate = open === 'update';
  const user = useUser();
  const form = useForm<TasksForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: user.user?.id,
      title: '',
      description: '',
      status: 'pending',
      priority: 'low',
      category: '',
      startTime: '',
      endTime: '',
      dueTime: '',
      estimatedTime: 30,
      style: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
      },
    },
  });

  // Load currentRow data into the form when updating
  useEffect(() => {
    if (isUpdate && currentRow) {
      // Populate form with currentRow data in update mode
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
        style: currentRow.style || {
          backgroundColor: '#ffffff',
          textColor: '#000000',
        },
      });
    } else {
      // Reset form to default values in create mode
      form.reset({
        userId: user.user?.id, // Default userId
        title: '',
        description: '',
        status: 'pending',
        priority: 'low',
        category: '',
        startTime: '',
        endTime: '',
        dueTime: '',
        estimatedTime: 0,
        style: {
          backgroundColor: '#ffffff',
          textColor: '#000000',
        },
      });
    }
  }, [currentRow, isUpdate]);

  const onSubmit = async (data: TasksForm) => {
    try {
      // Transform _id to id for backend compatibility
      const payload = {
        ...data,
        id: data._id || `TASK-${Date.now()}`, // Generate a new ID if not updating
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

  const handleToggle = (value: any) => {
    setIsDisabled(!value); // Toggle the disabled state
    if (!value) {
      // Reset the form fields when switching to disabled
      form.reset({
        startTime: '', // Default or initial values
        endTime: '',
        estimatedTime: 0,
      });
    }
  };

  return (
    <>
      <Dialog open={open === 'create' || open === 'update'} onOpenChange={(v) => {
        if (!v) {
          handleOpen(null); // Close dialog when toggled off
          form.reset();
        }
      }}>
        <DialogContent className="flex flex-col custom-scrollbar min-w-[640px] max-h-[100vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className='text-bold text-indigo-800'>{isUpdate ? 'Update' : 'Create'} Task</DialogTitle>
            <DialogDescription>
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
              className="flex flex-col flex-1">
              {/* Title Field */}
              <div className='flex justify-between w-full'>
                <div className='w-1/4'>
                  <p className='font-semibold text-indigo-700 text-sm'>Task details</p>
                </div>
                <div className='flex flex-col space-y-4 w-3/4'>
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
                  <div className='flex flex-row space-x-2'>
                    {/* Status Field */}
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="space-y-1 w-1/2">
                          <FormLabel>Status</FormLabel>
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
                        <FormItem className="space-y-1 w-1/2">
                          <FormLabel>Priority</FormLabel>
                          <SelectDropdown
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select priority"
                            items={[
                              { label: 'High', value: 'high' },
                              { label: 'Medium', value: 'medium' },
                              { label: 'Low', value: 'low' },
                            ]}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Category Field */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="space-y-1 w-1/2">
                        <FormLabel>Label</FormLabel>
                        <SelectDropdown
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select label"
                          items={[
                            { label: 'Documentation', value: 'documentation' },
                            { label: 'Feature', value: 'feature' },
                            { label: 'Bug', value: 'bug' },
                          ]}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Due Date Field */}
                  <FormField
                    control={form.control}
                    name="dueTime"
                    render={({ field }) => (
                      <FormItem className="space-y-2 w-1/2">
                        <FormLabel className='flex items-center space-x-2'>
                          <p>Due Time</p>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger disabled>
                                <LuInfo
                                  className="text-gray-500 hover:cursor-default pointer-events-none"
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                This is the task's deadline.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="datetime-local"
                            value={field.value ? field.value.slice(0, 16) : ''}
                            onChange={(e) => {
                              const inputValue = e.target.value; // This is in local datetime format
                              const vnLocalDate = new Date(inputValue); // Parse it as a local date
                              const offsetInMs = 7 * 60 * 60 * 1000; // Offset for UTC+7
                              const localTime = new Date(vnLocalDate.getTime() + offsetInMs)
                                .toISOString()
                              field.onChange(localTime); // Save the local time string
                            }}
                            className="bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <hr className='my-4' />
              <div className='flex justify-between w-full'>
                <div className='space-y-1.5 pr-4 w-1/4'>
                  <p className='font-semibold text-indigo-700 text-sm'>Time track options</p>
                  <div className='flex flex-col p-2 border rounded-md w-[120px]'>
                    <div className='flex items-center space-x-2 mx-auto'>
                      <p className='text-xs'>Set active:</p>
                      <Switch
                        checked={!isDisabled} // Toggle state
                        onCheckedChange={handleToggle}
                      />
                    </div>
                  </div>
                </div>
                <div className='flex flex-col space-y-4 mt-1 w-3/4'>
                  <div className='flex justify-between space-x-2'>
                    {/* Start Date Field */}
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem className="space-y-2 w-1/2">
                          <FormLabel className='flex items-center space-x-2'>
                            <p>Start Time</p>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger disabled>
                                  <LuInfo
                                    className="text-gray-500 hover:cursor-default pointer-events-none"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  Your time to start this task.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="datetime-local"
                              value={field.value ? field.value.slice(0, 16) : ''}
                              onChange={(e) => {
                                const inputValue = e.target.value; // This is in local datetime format
                                const vnLocalDate = new Date(inputValue); // Parse it as a local date
                                const offsetInMs = 7 * 60 * 60 * 1000; // Offset for UTC+7
                                const localTime = new Date(vnLocalDate.getTime() + offsetInMs)
                                  .toISOString()
                                field.onChange(localTime); // Save the local time string
                              }}
                              className="bg-white"
                              disabled={isDisabled}
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
                        <FormItem className="space-y-2 w-1/2">
                          <FormLabel className='flex items-center space-x-2'>
                            <p>End Time</p>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger disabled>
                                  <LuInfo
                                    className="text-gray-500 hover:cursor-default pointer-events-none"
                                  />
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
                              value={field.value ? field.value.slice(0, 16) : ''}
                              onChange={(e) => {
                                const inputValue = e.target.value; // This is in local datetime format
                                const vnLocalDate = new Date(inputValue); // Parse it as a local date
                                const offsetInMs = 7 * 60 * 60 * 1000; // Offset for UTC+7
                                const localTime = new Date(vnLocalDate.getTime() + offsetInMs)
                                  .toISOString()
                                field.onChange(localTime); // Save the local time string
                              }}
                              className="bg-white"
                              disabled={isDisabled}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='flex space-x-2'>
                    {/* Estimated time Field */}
                    <FormField
                      control={form.control}
                      name="estimatedTime"
                      render={({ field }) => (
                        <FormItem className="space-y-2 w-1/2">
                          <FormLabel className='flex items-center space-x-2'>
                            <p>Estimated Time</p>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger disabled>
                                  <LuInfo
                                    className="text-gray-500 hover:cursor-default pointer-events-none"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  Your estimated time to finish this task with start and end time.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(e);
                              }}
                              disabled={true}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Description
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter a description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </div>
              </div>
            </form>
          </Form>
          <div className="flex justify-end gap-2 mt-4">
            <DialogTrigger asChild>
              <Button variant="outline">Close</Button>
            </DialogTrigger>
            <Button form="tasks-form" type="submit" className='bg-indigo-800'>
              Save changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
