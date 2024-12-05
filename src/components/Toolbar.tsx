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
    <div className="p-4 border-b flex justify-center sm:justify-start">
      <div className="flex flex-col space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={selectedTool === "rectangle" ? "default" : "outline"}
                onClick={() => handleSelectTool("rectangle")}
                className="w-full sm:w-auto"
                disabled={!image}
              >
                <Square className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              className="px-3 py-2 bg-white rounded-md shadow-lg border border-slate-700"
            >
              <p>Add a rectangular annotation</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={selectedTool === "circle" ? "default" : "outline"}
                onClick={() => handleSelectTool("circle")}
                className="w-full sm:w-auto"
                disabled={!image}
              >
                <Circle className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              className="px-3 py-2 bg-white rounded-md shadow-lg border border-slate-700"
            >
              <p>Add a circular annotation</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={selectedTool === "select" ? "default" : "outline"}
                onClick={() => handleSelectTool("select")}
                className="w-full sm:w-auto"
                disabled={!image}
              >
                <MousePointer className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              className="px-3 py-2 bg-white rounded-md shadow-lg border border-slate-700"
            >
              <p>Select an annotation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
