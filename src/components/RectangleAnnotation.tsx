import { useAnnotations } from "@/contexts/AnnotationContext";
import { RectangleAnnotation as RectangleAnnotationT } from "@/types";
import { useEffect, useRef } from "react";
import { Rect as KonvaRect, Text, Transformer } from "react-konva";

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
  const { annotationKeyToEdit, updateAnnotation, setAnnotationKeyToEdit } =
    useAnnotations();

  const shapeRef = useRef<any>();
  const trRef = useRef<any>();

  const { x, y, width, height, label } = annotation;
  const isEditing = annotationKeyToEdit === annotation.key;
  const isHighlighted = isHovered || isEditing;

  useEffect(() => {
    if (isEditing) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isEditing]);

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    // we will reset it back
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
    const node = shapeRef.current;
    updateAnnotation({
      ...annotation,
      x: node.x(),
      y: node.y(),
    });
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
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      />
      {label && (
        <Text
          x={
            shapeRef.current ? shapeRef.current.x() + width / 2 : x + width / 2
          }
          y={
            shapeRef.current
              ? shapeRef.current.y() + height / 2
              : y + height / 2
          }
          text={label}
          fontSize={16}
          fill={isHighlighted ? "yellow" : "blue"}
          offsetX={label.length * 4}
          offsetY={8}
        />
      )}
      {isEditing && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          rotateEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
}
