import { Button } from "@/components/ui/button";
import { ActionType } from "@/types";
import { Circle, TextCursorIcon as Cursor, Square } from "lucide-react";

interface ToolbarProps {
  selectedTool: ActionType;
  onSelectTool: (tool: ActionType | null) => void;
}

export default function Toolbar({ selectedTool, onSelectTool }: ToolbarProps) {
  const handleSelectTool = (tool: ActionType) => {
    if (tool === selectedTool) onSelectTool(null);
    else onSelectTool(tool);
  };

  return (
    <div className="p-4 border-b flex justify-center sm:justify-start">
      <div className="flex flex-col space-y-2">
        <Button
          variant={selectedTool === "rectangle" ? "default" : "outline"}
          onClick={() => handleSelectTool("rectangle")}
          className="w-full sm:w-auto"
        >
          <Square className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Rectangle</span>
        </Button>
        <Button
          variant={selectedTool === "circle" ? "default" : "outline"}
          onClick={() => handleSelectTool("circle")}
          className="w-full sm:w-auto"
        >
          <Circle className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Circle</span>
        </Button>
        <Button
          variant={selectedTool === "select" ? "default" : "outline"}
          onClick={() => handleSelectTool("select")}
          className="w-full sm:w-auto"
        >
          <Cursor className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Edit</span>
        </Button>
      </div>
    </div>
  );
}
