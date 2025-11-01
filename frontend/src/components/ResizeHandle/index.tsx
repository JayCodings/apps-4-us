"use client";

export interface ResizeHandleProps {
  onDragStart: () => number;
  onDrag: (deltaX: number) => void;
  onDragEnd?: () => void;
}

export function ResizeHandle({ onDragStart, onDrag, onDragEnd }: ResizeHandleProps) {
  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();

    const startX = event.clientX;
    const startWidth = onDragStart();

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      onDrag(deltaX);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      onDragEnd?.();
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      className="w-0 bg-transparent cursor-col-resize relative"
      style={{ userSelect: "none" }}
    >
      <div className="absolute inset-y-0 -left-1 -right-1" />
    </div>
  );
}
