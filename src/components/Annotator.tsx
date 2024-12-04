import {
  Annotation,
  Annotorious,
  ImageAnnotator,
  UserSelectAction,
} from "@annotorious/react";

import { ActionType } from "@/types";
import "@annotorious/react/annotorious-react.css";
import { useState } from "react";
import ImageUpload from "./ImageUpload";

interface Props {
  selectedTool: ActionType;
}

export default function Annotator({ selectedTool }: Props) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const handleImageUpload = (uploadedImage: HTMLImageElement) => {
    setImage(uploadedImage);
  };

  // const handleAnnotationCreate = (e: UserSelectEvent) => {
  //   const { type, geometry } = e;

  //   // Salva l'annotazione creata
  //   const newAnnotation: Annotation = {
  //     id: crypto.randomUUID(),
  //     target: {
  //       annotation: {},
  //     },
  //     geometry,
  //     label: "New Annotation",
  //   };

  //   setAnnotations((prevAnnotations) => [...prevAnnotations, newAnnotation]);
  // };

  // const handleAnnotationEdit = (e: UserSelectEvent) => {
  //   const { id, geometry } = e;

  //   // Modifica l'annotazione selezionata
  //   setAnnotations((prevAnnotations) =>
  //     prevAnnotations.map((annotation) =>
  //       annotation.id === id ? { ...annotation, geometry } : annotation
  //     )
  //   );
  // };

  return (
    <>
      {!image && <ImageUpload onImageUpload={handleImageUpload} />}
      {image && (
        <Annotorious>
          <ImageAnnotator
            tool={
              selectedTool === "circle"
                ? "circle"
                : selectedTool === "rectangle"
                ? "rectangle"
                : ""
            }
            userSelectAction={
              selectedTool === "edit"
                ? UserSelectAction.EDIT
                : UserSelectAction.SELECT
            }
            // onCreate={handleAnnotationCreate} // Gestisce la creazione delle annotazioni
            // onUpdate={handleAnnotationEdit} // Gestisce la modifica delle annotazioni
          >
            <img src={image.src} alt="Uploaded" />
          </ImageAnnotator>
        </Annotorious>
      )}
    </>
  );
}
