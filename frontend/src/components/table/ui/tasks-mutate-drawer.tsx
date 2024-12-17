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
// New Validation Schema
const formSchema = z.object({
  id: z.string().optional(),
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
  const { setTasks } = useTaskContext();
  const isUpdate = open === 'update';
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const form = useForm<TasksForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      userId: 'USER-1234',
      title: '',
      description: '',
      status: 'pending',
      priority: 'low',
      category: '',
      startTime: '',
      endTime: '',
      dueTime: '',
      estimatedTime: undefined,
      style: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
      },
    },
  });

  // Load currentRow data into the form when updating
  useEffect(() => {
    if (isUpdate && currentRow) {
      form.reset({
        id: currentRow.id,
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
    }
  }, [currentRow, isUpdate]);

  const onSubmit = async (data: TasksForm) => {
    try {
      if (isUpdate) {
        await axios.patch(`http://localhost:3000/tasks/${data.id}`, data);
        setTasks((prev) =>
          prev.map((task) =>
            task.id === data.id ? { ...task, ...data } : task,
          ),
        );
        setToastMessage(`Task "${data.title}" has been successfully updated.`);
      } else {
        console.log(data);
        const response = await axios.post('http://localhost:3000/tasks', data);
        setTasks((prev) => [...prev, response.data]);
        setToastMessage(
          `Task "${response.data.title}" has been successfully created.`,
        );
      }

      handleOpen(null);
      form.reset();
    } catch (error) {
      console.error('Error submitting task:', error);
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
          if (!v) {
            handleOpen(null); // Close drawer when toggled off
            form.reset();
          }
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
                (errors, data) => {
                  console.log('Form not submitted with data:', data); // Should log if no errors
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
                name="category"
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

              {/* Due Date Field */}
              <FormField
                control={form.control}
                name="dueTime"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Due Time</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="datetime-local"
                        value={
                          field.value
                            ? field.value.replace('Z', '').slice(0, 16)
                            : ''
                        } // Trim to fit "YYYY-MM-DDTHH:MM"
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const isoValue = new Date(inputValue).toISOString();
                          field.onChange(isoValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="datetime-local"
                        value={
                          field.value
                            ? field.value.replace('Z', '').slice(0, 16)
                            : ''
                        } // Trim to fit "YYYY-MM-DDTHH:MM"
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const isoValue = new Date(inputValue).toISOString();
                          field.onChange(isoValue);
                        }}
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
                  <FormItem className="space-y-1">
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="datetime-local"
                        value={
                          field.value
                            ? field.value.replace('Z', '').slice(0, 16)
                            : ''
                        } // Trim to fit "YYYY-MM-DDTHH:MM"
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const isoValue = new Date(inputValue).toISOString();
                          field.onChange(isoValue);
                        }}
                      />
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
