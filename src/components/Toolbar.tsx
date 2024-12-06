import { Button } from "@/components/ui/button";
import { useAnnotations } from "@/contexts/AnnotationContext";
import { ActionType } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Circle, MousePointer, Square } from "lucide-react";

export default function Toolbar() {
  const { selectedTool, setSelectedTool, image } = useAnnotations();
  const handleSelectTool = (tool: ActionType) => {
    if (tool === selectedTool) setSelectedTool(null);
    else setSelectedTool(tool);
  };

  return (
    <div className="p-4 border-b flex justify-center sm:justify-start bg-slate-200 rounded-md border border-slate-400">
      <div className="flex flex-col space-y-3">
        <p className="text-center text-slate-600 text-sm font-medium leading-none my-3">
          Tools
        </p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              className={!image ? "cursor-not-allowed" : ""}
              asChild
            >
              <Button
                variant={selectedTool === "rectangle" ? "default" : "outline"}
                onClick={() => handleSelectTool("rectangle")}
                disabled={!image}
                className={!image ? "cursor-not-allowed" : ""}
              >
                <Square className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              className="px-3 py-2 bg-white rounded-md shadow-lg border border-slate-700"
            >
              <p>
                {!image ? "Add an image first" : "Add a rectangular annotation"}
              </p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              className={!image ? "cursor-not-allowed" : ""}
              asChild
            >
              <Button
                variant={selectedTool === "circle" ? "default" : "outline"}
                onClick={() => handleSelectTool("circle")}
                disabled={!image}
                className={!image ? "cursor-not-allowed" : ""}
              >
                <Circle className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              className="px-3 py-2 bg-white rounded-md shadow-lg border border-slate-700"
            >
              <p>
                {!image ? "Add an image first" : "Add a circular annotation"}
              </p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              className={!image ? "cursor-not-allowed" : ""}
              asChild
            >
              <Button
                variant={selectedTool === "select" ? "default" : "outline"}
                onClick={() => handleSelectTool("select")}
                disabled={!image}
                className={!image ? "cursor-not-allowed" : ""}
              >
                <MousePointer className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              className="px-3 py-2 bg-white rounded-md shadow-lg border border-slate-700"
            >
              <p>{!image ? "Add an image first" : "Select an annotation"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
