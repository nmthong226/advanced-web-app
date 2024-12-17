import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
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
import { useTasksContext } from '../context/task-context'; // Task UI management
import { useTaskContext } from '@/contexts/UserTaskContext.tsx'; // Task data management
import axios from 'axios';
import { useState } from 'react';

// Validation Schema
const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  status: z.string().min(1, 'Please select a status.'),
  label: z.string().min(1, 'Please select a label.'),
  priority: z.string().min(1, 'Please choose a priority.'),
  startDate: z.string().min(1, 'Start date is required.'),
  endDate: z.string().min(1, 'End date is required.'),
  description: z.string().min(1, 'Description is required.'),
  userId: z.string().min(1, 'UserId is required.'), // Ensure this is included
});

type TasksForm = z.infer<typeof formSchema>;

export function TasksMutateDrawer() {
  const { open, currentRow, handleOpen } = useTasksContext(); // Manage drawer state
  const { setTasks } = useTaskContext(); // Manage task list
  const isUpdate = open === 'update';
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form management
  const form = useForm<TasksForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isUpdate
      ? {
          title: currentRow?.title || '',
          status: currentRow?.status || '',
          label: currentRow?.label || '',
          priority: currentRow?.priority || '',
          startDate: currentRow?.startDate || '',
          endDate: currentRow?.endDate || '',
          description: currentRow?.description || '',
          userId: currentRow?.userId || '', // Include userId in update mode
        }
      : {
          title: '',
          status: '',
          label: '',
          priority: '',
          startDate: '',
          endDate: '',
          description: '',
          userId: 'USER-1234', // Default userId for create mode
        },
  });

  // Update form values when `currentRow` changes
  useEffect(() => {
    if (isUpdate && currentRow) {
      form.reset({
        title: currentRow.title,
        status: currentRow.status,
        label: currentRow.label,
        priority: currentRow.priority,
        startDate: currentRow.startDate,
        endDate: currentRow.endDate,
        description: currentRow.description,
        userId: currentRow.userId, // Reset userId in update mode
      });
    } else if (!isUpdate) {
      form.reset({
        title: '',
        status: '',
        label: '',
        priority: '',
        startDate: '',
        endDate: '',
        description: '',
        userId: 'USER-1234', // Default userId for create mode
      });
    }
  }, [currentRow, isUpdate]);

  const onSubmit = async (data: TasksForm) => {
    console.log('onSubmit triggered'); // Debug: Check if onSubmit is called
    console.log('Form data:', data); // Debug: Check the data passed to the function

    try {
      if (isUpdate) {
        console.log('Update mode detected'); // Debug: Check if it's in update mode

        const updatedTask = { ...currentRow!, ...data }; // Merge new data with current task
        console.log('Updated task object:', updatedTask); // Debug: Check the task object to be sent

        await axios.patch(
          `http://localhost:3000/tasks/${currentRow?.id}`,
          data,
        );

        // Update task list in context
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task,
          ),
        );

        setToastMessage(`Task "${data.title}" has been successfully updated.`);
      } else {
        console.log('Create mode detected'); // Debug: Check if it's in create mode

        const response = await axios.post('http://localhost:3000/tasks', data);

        console.log('Response from server:', response.data); // Debug: Check the response from the server

        // Add the new task to the context
        setTasks((prevTasks) => [...prevTasks, response.data]);

        setToastMessage(
          `Task "${response.data.title}" has been successfully created.`,
        );
      }

      handleOpen(null); // Close the drawer
      form.reset(); // Reset form fields
      console.log('Form successfully submitted'); // Debug: Ensure form submission logic completes
    } catch (error) {
      console.error('Error submitting task:', error); // Debug: Check for any errors
      setToastMessage('Failed to save the task. Please try again later.');
    }
  };

  return (
    <ToastProvider>
      <ToastViewport />
      {toastMessage && (
        <Toast
          variant="default"
          duration={3000}
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
        open={open === 'create' || open === 'update'}
        onOpenChange={(v) => {
          if (!v) handleOpen(null); // Close drawer when toggled off
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
              onSubmit={form.handleSubmit(
                (data) => {
                  console.log('Form successfully submitted with data:', data); // Should log if no errors
                  onSubmit(data);
                },
                (errors) => {
                  console.error('Validation errors:', errors); // Debug validation errors
                },
              )}
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
                        { label: 'Pending', value: 'pending' },
                        { label: 'In Progress', value: 'in-progress' },
                        { label: 'Compeleted', value: 'completed' },
                        { label: 'Expired', value: 'expired' },
                      ]}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/*Descri[tion*/}
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
              />

              {/* Label Field */}
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

              {/* Priority Field */}
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
