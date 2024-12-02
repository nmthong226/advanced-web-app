import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { GoTrash } from "react-icons/go";

interface NotifyDeletionProps {
  setIsDeleteDialogOpen: (isTriggered: boolean) => void;
}

const NotifyDeletion: React.FC<NotifyDeletionProps> = ({ setIsDeleteDialogOpen }) => {
  const handleDelete = () => {
    // Close the dialog
    setIsDeleteDialogOpen(false);

    // Show the toast
    toast("Item has been deleted", {
      description: "Your command is completed successfully.",
      action: {
        label: "Undo",
        onClick: () => {
          // Logic for undoing the delete, if needed
          console.log("Undo action triggered");
        },
      },
    });
  };

  return (
    <Button variant="outline" onClick={handleDelete}>
      <GoTrash />
      Delete
    </Button>
  );
};

export default NotifyDeletion;