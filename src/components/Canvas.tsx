import {
  ActionType,
  Annotation,
  CircleAnnotation,
  RectangleAnnotation,
} from "@/types";
import { KonvaEventObject } from "konva/lib/Node";
import React, { useState } from "react";
import { Circle, Image, Layer, Rect, Stage, Text } from "react-konva";
import ImageUpload from "./ImageUpload";
import LabelInput from "./LabelInput";

type Props = {
  selectedAction: ActionType;
};

export default function Canvas({ selectedAction }: Props) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [newAnnotation, setNewAnnotation] = useState<Annotation | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [labelModal, setLabelModal] = useState<{
    visible: boolean;
    annotationKey: string | null;
  }>({ visible: false, annotationKey: null });

  const handleMouseDown = (event: KonvaEventObject<MouseEvent>) => {
    if (
      !newAnnotation &&
      (selectedAction === "rectangle" || selectedAction === "circle")
    ) {
      const position = event.target.getStage()?.getPointerPosition();
      if (!position) return;
      const { x, y } = position;

      setNewAnnotation({
        x,
        y,
        key: "temp",
        ...(selectedAction === "rectangle"
          ? { type: "rectangle", width: 0, height: 0 }
          : { type: "circle", radius: 0 }),
      });
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
      const newKey = `annotation-${annotations.length + 1}`;
      setAnnotations((prev) => [...prev, { ...newAnnotation, key: newKey }]);
      setLabelModal({ visible: true, annotationKey: newKey });
      setNewAnnotation(null);
    }
  };

  const handleLabelSave = (label: string) => {
    if (!labelModal.annotationKey) return;

    // Troviamo l'annotazione con la chiave giusta e aggiungiamo la label
    setAnnotations((prev) =>
      prev.map((annotation) =>
        annotation.key === labelModal.annotationKey
          ? { ...annotation, label }
          : annotation
      )
    );

    // Chiudiamo la modale e resettiamo lo stato
    setLabelModal({ visible: false, annotationKey: null });
  };

  const handleLabelCancel = () => {
    // Rimuoviamo l'annotazione senza label
    setAnnotations((prev) =>
      prev.filter(
        (annotation) => annotation.key !== `annotation-${annotations.length}`
      )
    );

    // Chiudiamo la modale e resettiamo lo stato
    setLabelModal({ visible: false, annotationKey: null });
  };

  const annotationsToDraw = newAnnotation
    ? [...annotations, newAnnotation]
    : annotations;

  return (
    <div className="flex-1 flex flex-col items-center overflow-hidden h-full p-4">
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
            {annotationsToDraw.map((value) => {
              if (value.type === "rectangle") {
                return (
                  <React.Fragment key={value.key}>
                    <Rect
                      x={value.x}
                      y={value.y}
                      width={value.width}
                      height={value.height}
                      fill="transparent"
                      stroke="black"
                    />
                    {value.label && (
                      <Text
                        x={value.x + value.width / 2}
                        y={value.y + value.height / 2}
                        text={value.label}
                        fontSize={16}
                        fill="black"
                        offsetX={value.label.length * 4} // Adjust for centering text
                        offsetY={8} // Adjust for centering text
                      />
                    )}
                  </React.Fragment>
                );
              } else if (value.type === "circle") {
                return (
                  <React.Fragment key={value.key}>
                    <Circle
                      x={value.x}
                      y={value.y}
                      radius={value.radius}
                      fill="transparent"
                      stroke="blue"
                    />
                    {value.label && (
                      <Text
                        x={value.x}
                        y={value.y}
                        text={value.label}
                        fontSize={16}
                        fill="blue"
                        offsetX={value.label.length * 4} // Mantieni questo per centrare orizzontalmente
                        offsetY={8} // Mantieni questo per centrare verticalmente
                      />
                    )}
                  </React.Fragment>
                );
              }
              return null;
            })}
          </Layer>
        </Stage>
      )}
      {labelModal.visible && (
        <LabelInput
          open={labelModal.visible}
          onSubmit={handleLabelSave}
          onCancel={handleLabelCancel}
        />
      )}
    </div>
  );
}
