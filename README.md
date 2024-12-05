# Annotation Editor with React-Konva

This project is an interactive annotation tool built with **React-Konva** and **React-Konva-Utils**. It allows users to create, edit, and manage annotations of various shapes (rectangles and circles) directly on a canvas. The tool supports features like drag-and-drop, resizing, and label editing through an intuitive UI.

## Features

- **Shape Annotations**: Supports both rectangle and circle annotations.
- **Editing Modes**:
  - Resize shapes with handles.
  - Drag-and-drop to reposition shapes.
  - Modify labels through a dedicated modal interface.
- **Dynamic Highlighting**: Shapes are highlighted on hover and during editing.
- **Cross-Platform Compatibility**: Works seamlessly on desktop and touch devices.
- **Reusable Design**: Unified annotation logic for different shapes (rectangle and circle).

## Technology Stack

- **React**: UI framework for managing application state and rendering components.
- **React-Konva**: Library for managing canvas-based elements with React.
- **React-Konva-Utils**: Adds utility features like DOM integration for modals and buttons within Konva stages.
- **TypeScript**: For strict type safety and better developer experience.

## Installation

To set up and run the project locally, follow these steps:

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (>= 16.x recommended)
- [Yarn](https://yarnpkg.com/) (preferred package manager)

### Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/annotation-editor.git
   cd annotation-editor
   ```

2. **Install dependencies**:

```bash
 yarn install
```

3. **Run the development server**:

```bash
 yarn dev
```
