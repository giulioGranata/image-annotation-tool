import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import { AnnotationProvider } from "./contexts/AnnotationContext";

function App() {
  return (
    <AnnotationProvider>
      <div className="flex flex-row h-screen bg-slate-100">
        <div className="flex-1 overflow-hidden">
          <Canvas />
        </div>
        <Toolbar />
      </div>
    </AnnotationProvider>
  );
}

export default App;
