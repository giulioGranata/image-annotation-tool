import { useAnnotations } from "@/contexts/AnnotationContext";
import { CircleAnnotation as CircleAnnotationT } from "@/types";
import { useEffect, useRef, useState } from "react";
import { Circle as KonvaCircle, Text, Transformer } from "react-konva";
import { Html } from "react-konva-utils";
import AnnotationLabelModal from "./AnnotationLabelModal";
import { Button } from "./ui/button";

type Props = {
  annotation: CircleAnnotationT;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
};

export default function CircleAnnotation({
  annotation,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: Props) {
  const { annotationKeyToEdit, updateAnnotation } = useAnnotations();
  // Stato per mostrare la modale di modifica dell'etichetta
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  // Stato per nascondere la label mentre si sposta o ridimensiona la forma
  const [isMovingOrResizing, setIsMovingOrResizing] = useState(false);

  // Riferimenti di Konva per gestire il transformer
  const shapeRef = useRef<any>();
  const trRef = useRef<any>();

  const { x, y, radius, label } = annotation;
  const isEditing = annotationKeyToEdit === annotation.key;
  const isHighlighted = isHovered || isEditing;

  useEffect(() => {
    if (isEditing) {
      // Attacca manualmente il transformer alla forma
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isEditing]);

  const handleTransformEnd = () => {
    setIsMovingOrResizing(false);
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    // Resetta il fattore di scala
    node.scaleX(1);
    node.scaleY(1);
    updateAnnotation({
      ...annotation,
      x: node.x(),
      y: node.y(),
      radius: node.radius() * scaleX, // Ridimensionamento del cerchio
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
      <KonvaCircle
        ref={shapeRef}
        x={x}
        y={y}
        radius={radius}
        fill="transparent"
        stroke={isHighlighted ? "yellow" : "green"}
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
          x={x - label.length * 4} // Posiziona la label al centro del cerchio
          y={y - 8} // Posiziona la label sopra il cerchio
          text={label}
          fontSize={16}
          fill={isHighlighted ? "yellow" : "green"}
        />
      )}
      {isEditing && (
        <>
          <Transformer
            ref={trRef}
            flipEnabled={false}
            rotateEnabled={false}
            boundBoxFunc={(oldBox, newBox) => {
              // Previene il ridimensionamento troppo piccolo
              if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
          {/* Pulsante per modificare la label */}
          {!isMovingOrResizing && (
            <Html>
              <Button
                style={{
                  position: "absolute",
                  left: `${x}px`,
                  top: `${y - radius - 30}px`, // Posiziona il pulsante sopra il cerchio
                  transform: "translate(-50%, -50%)",
                  zIndex: 10,
                }}
                onClick={() => setIsLabelModalOpen(true)}
              >
                Edit Label
              </Button>
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
