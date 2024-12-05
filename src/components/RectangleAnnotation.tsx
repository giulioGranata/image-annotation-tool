import { useAnnotations } from "@/contexts/AnnotationContext";
import { RectangleAnnotation as RectangleAnnotationT } from "@/types";
import { useEffect, useRef, useState } from "react";
import { Rect as KonvaRect, Text, Transformer } from "react-konva";
import { Html } from "react-konva-utils";
import AnnotationLabelModal from "./AnnotationLabelModal";
import { Button } from "./ui/button";

type Props = {
  annotation: RectangleAnnotationT;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
};

export default function RectangleAnnotation({
  annotation,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: Props) {
  const { annotationKeyToEdit, updateAnnotation } = useAnnotations();
  // State to show the edit label modal
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  // State to hide the label while moving or resizing the shape
  const [isMovingOrResizing, setIsMovingOrResizing] = useState(false);

  // Konva refs to handle transformer
  const shapeRef = useRef<any>();
  const trRef = useRef<any>();

  const { x, y, width, height, label } = annotation;
  const isEditing = annotationKeyToEdit === annotation.key;
  const isHighlighted = isHovered || isEditing;

  useEffect(() => {
    if (isEditing) {
      // Attach transformer manually to the shape
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isEditing]);

  const handleTransformEnd = () => {
    setIsMovingOrResizing(false);
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    // Reset to default scale
    node.scaleX(1);
    node.scaleY(1);
    updateAnnotation({
      ...annotation,
      x: node.x(),
      y: node.y(),
      width: node.width() * scaleX,
      height: node.height() * scaleY,
    });
  };

  const handleDragEnd = () => {
    setIsMovingOrResizing(false);
    const node = shapeRef.current;
    updateAnnotation({
      ...annotation,
      x: node.x(),
      y: node.y(),
    });
  };

  const handleLabelSubmit = (newLabel: string) => {
    updateAnnotation({
      ...annotation,
      label: newLabel,
    });
    setIsLabelModalOpen(false);
  };

  const handleLabelCancel = () => {
    setIsLabelModalOpen(false);
  };

  return (
    <>
      <KonvaRect
        ref={shapeRef}
        x={x}
        y={y}
        width={width}
        height={height}
        fill="transparent"
        stroke={isHighlighted ? "yellow" : "blue"}
        strokeWidth={isHighlighted ? 3 : 1}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        draggable={isEditing}
        onDragStart={() => setIsMovingOrResizing(true)}
        onDragEnd={handleDragEnd}
        onTransformStart={() => setIsMovingOrResizing(true)}
        onTransformEnd={handleTransformEnd}
      />
      {label && !isMovingOrResizing && (
        <Text
          x={x + width / 2}
          y={y + height / 2}
          text={label}
          fontSize={16}
          fill={isHighlighted ? "yellow" : "blue"}
          offsetX={label.length * 4}
          offsetY={8}
        />
      )}
      {isEditing && (
        <>
          <Transformer
            ref={trRef}
            flipEnabled={false}
            rotateEnabled={false}
            boundBoxFunc={(oldBox, newBox) => {
              // Prevent resizing too small
              if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
          {/* Pulsante per modificare la label */}
          {!isMovingOrResizing && (
            // Using Html to use the button in the Konva canvas,
            // otherwise you can't use external components like Button
            // or Modal inside the Konva Stage
            <Html>
              <Button
                style={{
                  position: "absolute",
                  left: `${x + width / 2}px`,
                  top: `${y - 30}px`, // Posiziona il pulsante sopra la forma
                  transform: "translate(-50%, -50%)",
                  zIndex: 10,
                }}
                onClick={() => setIsLabelModalOpen(true)}
              >
                Edit Label
              </Button>
              {/* Modale per modificare l'etichetta */}
              <AnnotationLabelModal
                open={isLabelModalOpen}
                onSubmit={handleLabelSubmit}
                onCancel={handleLabelCancel}
              />
            </Html>
          )}
        </>
      )}
    </>
  );
}
