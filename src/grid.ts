import { mazeData } from "./mazeData";

interface Cell {
  x: number;
  y: number;
  wall: boolean;
}

const maze = mazeData.map((row, rowIndex): Cell[] => {
  return row.split("").map((cell, cellIndex) => ({
    x: cellIndex,
    y: rowIndex,
    wall: cell === "#",
  }));
});

const cellSize = 50;
const canvas = <HTMLCanvasElement>document.getElementById("canvas");
canvas.width = maze[0].length * cellSize;
canvas.height = maze.length * cellSize;
const context = canvas.getContext("2d");

const paintCells = (cells: Cell[], fillStyle: string) => {
  context.fillStyle = fillStyle;
  cells.forEach((cell) => {
    context.fillRect(
      cell.x * cellSize + 1,
      cell.y * cellSize + 1,
      cellSize - 2,
      cellSize - 2
    );
  });
};

export { maze, paintCells };
