export type AnnotationType = "rectangle" | "circle";

export type ActionType = "rectangle" | "circle" | "select" | null;

interface BaseAnnotation {
  x: number;
  y: number;
  key: string;
  type: AnnotationType;
  label?: string;
}

export interface RectangleAnnotation extends BaseAnnotation {
  type: "rectangle";
  width: number;
  height: number;
}

export interface CircleAnnotation extends BaseAnnotation {
  type: "circle";
  radius: number;
}

export type Annotation = RectangleAnnotation | CircleAnnotation;
