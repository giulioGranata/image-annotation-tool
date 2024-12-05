import { useAnnotations } from "@/contexts/AnnotationContext";
import {
  Annotation as AnnotationT,
  CircleAnnotation,
  RectangleAnnotation,
} from "@/types";
import { KonvaEventObject } from "konva/lib/Node";
import { useState } from "react";
import { Image, Layer, Stage } from "react-konva";
import Annotation from "./Annotation";
import AnnotationLabelModal from "./AnnotationLabelModal";
import ImageUpload from "./ImageUpload";

export default function Canvas() {
  const {
    annotationKeyToEdit,
    selectedTool,
    annotations,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    setAnnotationKeyToEdit,
  } = useAnnotations();

  const [newAnnotation, setNewAnnotation] = useState<AnnotationT | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [labelModal, setLabelModal] = useState<{
    visible: boolean;
    annotationKey: string | null;
  }>({ visible: false, annotationKey: null });

  const handleMouseDown = (event: KonvaEventObject<MouseEvent>) => {
    if (
      !newAnnotation &&
      (selectedTool === "rectangle" || selectedTool === "circle")
    ) {
      const position = event.target.getStage()?.getPointerPosition();
      if (!position) return;
      const { x, y } = position;

      setNewAnnotation({
        x,
        y,
        key: `annotation-${annotations.length + 1}`,
        ...(selectedTool === "rectangle"
          ? { type: "rectangle", width: 0, height: 0 }
          : { type: "circle", radius: 0 }),
      });
    }

    // Exit from edit mode
    const clickedOnImage = event.target?.getClassName() === "Image";
    if (clickedOnImage && annotationKeyToEdit && selectedTool === "select") {
      setAnnotationKeyToEdit(null);
    }
  };

  const handleMouseMove = (event: KonvaEventObject<MouseEvent>) => {
    if (newAnnotation) {
      const position = event.target.getStage()?.getPointerPosition();
      if (!position) return;
      const { x, y } = position;

      if (newAnnotation.type === "rectangle") {
        const updatedAnnotation: RectangleAnnotation = {
          ...newAnnotation,
          width: x - newAnnotation.x,
          height: y - newAnnotation.y,
        };
        setNewAnnotation(updatedAnnotation);
      } else if (newAnnotation.type === "circle") {
        const dx = x - newAnnotation.x;
        const dy = y - newAnnotation.y;
        const radius = Math.sqrt(dx * dx + dy * dy);
        const updatedAnnotation: CircleAnnotation = {
          ...newAnnotation,
          radius,
        };
        setNewAnnotation(updatedAnnotation);
      }
    }
  };

  const handleMouseUp = () => {
    if (newAnnotation) {
      addAnnotation(newAnnotation);
      setLabelModal({ visible: true, annotationKey: newAnnotation.key });
      setNewAnnotation(null);
    }
  };

  const handleLabelSave = (label: string) => {
    if (!labelModal.annotationKey) return;

    // Troviamo l'annotazione con la chiave giusta e aggiungiamo la label
    const annotationToUpdate = annotations.find(
      (annotation) => annotation.key === labelModal.annotationKey
    );
    if (!annotationToUpdate) return;

    updateAnnotation({
      ...annotationToUpdate,
      label,
    });

    // Chiudiamo la modale e resettiamo lo stato
    setLabelModal({ visible: false, annotationKey: null });
  };

  const handleLabelCancel = () => {
    // Rimuoviamo l'annotazione senza label
    deleteAnnotation(`annotation-${annotations.length}`);

    // Chiudiamo la modale e resettiamo lo stato
    setLabelModal({ visible: false, annotationKey: null });
  };

  const annotationsToDraw = newAnnotation
    ? [...annotations, newAnnotation]
    : annotations;

  return (
    <div className="flex-1 flex flex-col justify-center items-center overflow-hidden h-full p-4">
      {!image && <ImageUpload onImageUpload={setImage} />}
      {image && (
        <Stage
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          width={image.width}
          height={image.height}
          style={{ border: "1px solid black" }}
        >
          <Layer>
            <Image image={image} width={image.width} height={image.height} />
            {annotationsToDraw.map((value) => (
              <Annotation key={value.key} annotation={value} />
            ))}
          </Layer>
        </Stage>
      )}
      {labelModal.visible && (
        <AnnotationLabelModal
          open={labelModal.visible}
          onSubmit={handleLabelSave}
          onCancel={handleLabelCancel}
        />
      )}
    </div>
  );
}
