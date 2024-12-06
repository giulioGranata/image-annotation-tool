import { useAnnotations } from "@/contexts/AnnotationContext";
import { Annotation as AnnotationType } from "@/types";
import { useState } from "react";

type Props = {
  annotation: AnnotationType;
};

import { useEffect, useRef } from "react";
import {
  Circle as KonvaCircle,
  Rect as KonvaRect,
  Text,
  Transformer,
} from "react-konva";
import { Html } from "react-konva-utils";
import AnnotationLabelModal from "./AnnotationLabelModal";
import { Button } from "./ui/button";

export default function Annotation({ annotation }: Props) {
  const {
    selectedTool,
    annotationKeyToEdit,
    setAnnotationKeyToEdit,
    updateAnnotation,
  } = useAnnotations();

  const [isHovered, setIsHovered] = useState(false);

  // State per aprire la modale di modifica dell'etichetta
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  // State per nascondere l'etichetta durante il movimento o il ridimensionamento
  const [isMovingOrResizing, setIsMovingOrResizing] = useState(false);

  // Riferimenti di Konva per gestire il transformer
  const shapeRef = useRef<any>();
  const trRef = useRef<any>();

  let radius, width, height;
  const { label, x, y, type } = annotation;

  if (type === "rectangle") {
    width = annotation.width;
    height = annotation.height;
  }
  if (type === "circle") {
    radius = annotation.radius;
  }

  const isEditing = annotationKeyToEdit === annotation.key;
  const isHighlighted = isHovered || isEditing;

  useEffect(() => {
    if (isEditing) {
      // Aggiungi manualmente il transformer alla forma
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isEditing]);

  const onMouseEnter = () => {
    if (selectedTool !== "select" || annotationKeyToEdit) return;
    setIsHovered(true);
  };

  const onMouseLeave = () => {
    if (selectedTool !== "select") return;
    setIsHovered(false);
  };

  const handleTransformEnd = () => {
    setIsMovingOrResizing(false);
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    if (type === "rectangle") {
      updateAnnotation({
        ...annotation,
        x: node.x(),
        y: node.y(),
        width: node.width() * scaleX,
        height: node.height() * scaleY,
      });
    }

    if (type === "circle") {
      updateAnnotation({
        ...annotation,
        x: node.x(),
        y: node.y(),
        radius: node.radius() * scaleX,
      });
    }
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

  const handleAnnotationClick = () => {
    if (selectedTool === "select" && !annotationKeyToEdit)
      setAnnotationKeyToEdit(annotation.key);
  };

  const shape =
    type === "circle" ? (
      <KonvaCircle
        ref={shapeRef}
        x={x}
        y={y}
        radius={radius}
        fill="transparent"
        stroke={isHighlighted ? "limegreen" : "orange"}
        strokeWidth={isHighlighted ? 5 : 3}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={handleAnnotationClick}
        draggable={isEditing}
        onDragStart={() => setIsMovingOrResizing(true)}
        onDragEnd={handleDragEnd}
        onTransformStart={() => setIsMovingOrResizing(true)}
        onTransformEnd={handleTransformEnd}
      />
    ) : (
      <KonvaRect
        ref={shapeRef}
        x={x}
        y={y}
        width={width}
        height={height}
        fill="transparent"
        stroke={isHighlighted ? "limegreen" : "orange"}
        strokeWidth={isHighlighted ? 5 : 3}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={handleAnnotationClick}
        draggable={isEditing}
        onDragStart={() => setIsMovingOrResizing(true)}
        onDragEnd={handleDragEnd}
        onTransformStart={() => setIsMovingOrResizing(true)}
        onTransformEnd={handleTransformEnd}
      />
    );

  return (
    <>
      {shape}
      {label && !isMovingOrResizing && (
        <Text
          x={type === "circle" ? x - label.length * 4 : x + width! / 2} // Posiziona la label al centro del cerchio
          y={type === "circle" ? y - 8 : y + height! / 2} // Posiziona la label sopra il cerchio
          text={label}
          fontSize={16}
          fill={isHighlighted ? "limegreen" : "orange"}
          offsetX={type === "circle" ? 0 : label.length * 4}
          offsetY={type === "circle" ? 0 : 8}
        />
      )}
      {isEditing && (
        <>
          <Transformer
            ref={trRef}
            flipEnabled={false}
            rotateEnabled={false}
            boundBoxFunc={(oldBox, newBox) => {
              // Impedire il ridimensionamento troppo piccolo
              if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
          {/* Pulsante per modificare l'etichetta */}
          {!isMovingOrResizing && (
            <Html>
              <Button
                style={{
                  position: "absolute",
                  left: `${x + (type === "circle" ? 0 : width!) / 2}px`,
                  top: `${y - (type === "circle" ? radius! : 0) - 30}px`, // Posiziona il pulsante sopra la forma
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
