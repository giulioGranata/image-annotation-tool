import { useState } from "react";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import { AnnotationProvider } from "./contexts/AnnotationContext";
import { ActionType } from "./types";

function App() {
  const [selectedTool, setSelectedTool] = useState<ActionType>(null);

  return (
    <AnnotationProvider>
      <div className="flex flex-row h-screen">
        <div className="flex-1 overflow-hidden">
          <Canvas selectedAction={selectedTool} />
        </div>
        <Toolbar selectedTool={selectedTool} onSelectTool={setSelectedTool} />
      </div>
    </AnnotationProvider>
  );
}

export default App;
