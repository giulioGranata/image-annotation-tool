import React, { createContext, useContext, useState } from "react";
import { ActionType, Annotation } from "../types";

interface AnnotationContextType {
  annotations: Annotation[];
  addAnnotation: (annotation: Annotation) => void;
  updateAnnotation: (annotation: Annotation) => void;
  deleteAnnotation: (key: string) => void;
  selectedTool: ActionType;
  setSelectedTool: (tool: ActionType) => void;
  annotationKeyToEdit: string | null;
  setAnnotationKeyToEdit: (key: string | null) => void;
}

const AnnotationContext = createContext<AnnotationContextType | undefined>(
  undefined
);

export function AnnotationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedTool, setSelectedTool] = useState<ActionType | null>(null);
  const [annotationKeyToEdit, setAnnotationKeyToEdit] = useState<string | null>(
    null
  );

  const addAnnotation = (annotation: Annotation) => {
    setAnnotations([...annotations, annotation]);
  };

  const updateAnnotation = (updatedAnnotation: Annotation) => {
    setAnnotations(
      annotations.map((ann) =>
        ann.key === updatedAnnotation.key ? updatedAnnotation : ann
      )
    );
  };

  const deleteAnnotation = (key: string) => {
    setAnnotations(annotations.filter((ann) => ann.key !== key));
  };

  return (
    <AnnotationContext.Provider
      value={{
        annotations,
        addAnnotation,
        updateAnnotation,
        deleteAnnotation,
        selectedTool,
        setSelectedTool,
        annotationKeyToEdit,
        setAnnotationKeyToEdit,
      }}
    >
      {children}
    </AnnotationContext.Provider>
  );
}

export function useAnnotations() {
  const context = useContext(AnnotationContext);
  if (context === undefined) {
    throw new Error("useAnnotations must be used within an AnnotationProvider");
  }
  return context;
}
