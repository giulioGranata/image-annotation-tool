import { useAnnotations } from "@/contexts/AnnotationContext";
import { Annotation as AnnotationType } from "@/types";
import React, { useState } from "react";
import CircleAnnotation from "./CircleAnnotation";
import RectangleAnnotation from "./RectangleAnnotation";

type Props = {
  annotation: AnnotationType;
};

export default function Annotation({ annotation }: Props) {
  const { selectedTool, annotationKeyToEdit, setAnnotationKeyToEdit } =
    useAnnotations();
  const [isHovered, setIsHovered] = useState(false);
  const { type } = annotation;

  const onMouseEnter = () => {
    if (selectedTool !== "select") return;
    setIsHovered(true);
  };

  const onMouseLeave = () => {
    if (selectedTool !== "select") return;
    setIsHovered(false);
  };

  const handleAnnotationClick = () => {
    if (selectedTool === "select" && !annotationKeyToEdit)
      setAnnotationKeyToEdit(annotation.key);
  };

  return (
    <React.Fragment>
      {type === "rectangle" && (
        <RectangleAnnotation
          annotation={annotation}
          isHovered={isHovered}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={handleAnnotationClick}
        />
      )}
      {type === "circle" && (
        <CircleAnnotation
          annotation={annotation}
          isHovered={isHovered}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={handleAnnotationClick}
        />
      )}
    </React.Fragment>
  );
}
