import { useAnnotations } from "@/contexts/AnnotationContext";
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
  open: boolean;
  onSubmit: (label: string) => void;
  onCancel?: () => void;
}

export default function AnnotationLabelModal({
  open,
  onSubmit,
  onCancel,
}: Props) {
  const { annotations, annotationKeyToEdit } = useAnnotations();
  const [label, setLabel] = useState(
    annotations.find((annotation) => annotation.key === annotationKeyToEdit)
      ?.label || ""
  );

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
