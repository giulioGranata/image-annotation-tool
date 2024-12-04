import { CircleAnnotation as CircleAnnotationT } from "@/types";
import { Circle as KonvaCircle, Text } from "react-konva";

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
  const { x, y, radius, label } = annotation;

  return (
    <>
      <KonvaCircle
        x={x}
        y={y}
        radius={radius}
        fill="transparent"
        stroke={isHovered ? "yellow" : "green"}
        strokeWidth={isHovered ? 3 : 1}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      />
      {label && (
        <Text
          x={x}
          y={y}
          text={label}
          fontSize={16}
          fill={isHovered ? "yellow" : "green"}
          offsetX={label.length * 4}
          offsetY={8}
        />
      )}
    </>
  );
}
