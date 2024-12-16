import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ToastProvider,
  Toast,
  ToastViewport,
  ToastAction,
  ToastTitle,
  ToastDescription,
} from 'src/components/ui/toast';
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
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from 'src/components/ui/sheet';
import { SelectDropdown } from 'src/components/ui/select-dropdown';
import { Task } from '../data/schema';
import axios from 'axios';
import { useState } from 'react';
import { useTasksContext } from '../context/task-context';

interface Props {
  open: boolean; // Determines if the drawer is open
  onOpenChange: (open: boolean) => void; // Callback to toggle the drawer's open state
  currentRow?: Task; // Optional current task for editing
  onTaskMutate: (task: Task, isUpdate: boolean) => void; // Callback to handle task creation or updates
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  status: z.string().min(1, 'Please select a status.'),
  label: z.string().min(1, 'Please select a label.'),
  priority: z.string().min(1, 'Please choose a priority.'),
  startDate: z.string().min(1, 'Start date is required.'),
  endDate: z.string().min(1, 'End date is required.'),
  description: z.string().min(1, 'Description is required.'),
});
type TasksForm = z.infer<typeof formSchema>;

export function TasksMutateDrawer({
  open,
  onOpenChange,
  onTaskMutate,
  currentRow,
}: Props) {
  const isUpdate = !!currentRow;
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]); // Manage the task list
  const form = useForm<TasksForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      title: '',
      status: '',
      label: '',
      priority: '',
      startDate: '',
      endDate: '',
      description: '',
    },
  });

  const onSubmit = async (data: TasksForm) => {
    try {
      let updatedTask: Task;

      if (isUpdate) {
        // Prepare the updated task with user input
        updatedTask = { ...currentRow!, ...data };

        // Optimistically update the frontend
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task,
          ),
        );

        // Call the backend to persist the changes
        await axios.patch(
          `http://localhost:3000/tasks/${currentRow?.id}`,
          data,
        );

        // Show success toast
        setToastMessage(`Task "${data.title}" has been successfully updated.`);
      } else {
        // Prepare the new task with a temporary ID
        const newTask: Task = {
          ...data,
          id: `TEMP-${Date.now()}`, // Temporary ID for optimistic UI
          userId: 'USER-1234', // Replace with actual userId
        };

        // Optimistically add the task to the frontend
        setTasks((prevTasks) => [...prevTasks, newTask]);

        // Call the backend to create the new task
        const response = await axios.post('http://localhost:3000/tasks', data);

        // Replace the temporary task with the server-generated task
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === newTask.id ? response.data : task,
          ),
        );

        // Show success toast
        setToastMessage(
          `Task "${response.data.title}" has been successfully created.`,
        );
      }

      onOpenChange(false); // Close the drawer
      form.reset(); // Reset the form fields
    } catch (error) {
      console.error('Error submitting task:', error);

      // Revert changes in case of an error
      setTasks((prevTasks) => {
        if (isUpdate) {
          // Revert the update
          return prevTasks.map((task) =>
            task.id === currentRow!.id ? currentRow! : task,
          );
        } else {
          // Remove the optimistically added task
          return prevTasks.filter((task) => !task.id.startsWith('TEMP-'));
        }
      });

      // Show error toast
      setToastMessage('Failed to save the task. Please try again later.');
    }
  };

  return (
    <ToastProvider>
      <ToastViewport />
      {toastMessage && (
        <Toast
          variant="default"
          duration={3000} // Toast stays for 3 seconds
          onOpenChange={() => setToastMessage(null)}
        >
          <ToastTitle>{isUpdate ? 'Task Updated' : 'Task Created'}</ToastTitle>
          <ToastDescription>{toastMessage}</ToastDescription>
          <ToastAction
            altText="Dismiss Notification"
            onClick={() => setToastMessage(null)}
          >
            Dismiss
          </ToastAction>
        </Toast>
      )}

      <Sheet
        open={open}
        onOpenChange={(v) => {
          onOpenChange(v);
          form.reset();
        }}
      >
        <SheetContent className="flex flex-col max-h-[100h] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{isUpdate ? 'Update' : 'Create'} Task</SheetTitle>
            <SheetDescription>
              {isUpdate
                ? 'Update the task by providing the necessary info.'
                : 'Add a new task by providing the necessary info.'}
              Click save when you're done.
            </SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form
              id="tasks-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex-1 space-y-5"
            >
              {/* Title Field */}
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

              {/* Status Field */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Status</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select status"
                      items={[
                        { label: 'In Progress', value: 'in progress' },
                        { label: 'Backlog', value: 'backlog' },
                        { label: 'Todo', value: 'todo' },
                        { label: 'Canceled', value: 'canceled' },
                        { label: 'Done', value: 'done' },
                      ]}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Label Field (Dropdown) */}
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem className="space-y-1">
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

              {/* Priority Field (Dropdown) */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="space-y-1">
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

              {/* Start Date Field */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Date Field */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <SheetFooter className="gap-2 mb-4">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
            <Button form="tasks-form" type="submit">
              Save changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </ToastProvider>
  );
}
