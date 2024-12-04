import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";

interface Props {
  annotationToEditLabel?: string;
  open: boolean;
  onSubmit: (label: string) => void;
  onCancel?: () => void;
}

export default function AnnotationLabelModal({
  annotationToEditLabel,
  open,
  onSubmit,
  onCancel,
}: Props) {
  const [label, setLabel] = useState(annotationToEditLabel || "");

  const handleSubmit = () => {
    if (label.trim() === "") {
      alert("Label cannot be empty.");
      return;
    }
    onSubmit(label);
    setLabel("");
  };

  const handleClose = () => {
    setLabel("");
    onCancel?.();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Annotation Label</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Please enter a label for the annotation.
        </DialogDescription>
        <Input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Enter label..."
          className="border rounded w-full p-2 mb-4"
        />
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!label || label.trim() === ""}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
