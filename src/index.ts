import { Cell, maze, paintCells } from "./grid";

const walls = maze.flat().filter(({ wall }) => wall);
const paths = maze.flat().filter(({ wall }) => !wall);

interface Node extends Cell {
  previous?: Node;
}

const getNode = (x: number, y: number) => {
  if (x < 0 || x >= maze[0].length || y < 0 || y >= maze.length) {
    // Out of bounds
    return null;
  }
  return { ...maze[y][x] };
};

const successors = (currentNode: Cell): Node[] => {
  const adjacent = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ];
  const successorNodes = adjacent
    .map((node) => getNode(currentNode.x + node.x, currentNode.y + node.y))
    .filter((node) => node !== null)
    .filter(({ wall }) => !wall);
  return successorNodes.map((successor) => ({
    ...successor,
    previous: currentNode,
  }));
};

const isSameLocation = (source: Cell, target: Cell) => {
  return source.x === target.x && source.y === target.y;
};

const getPath = (node: Node): Node[] => {
  return node.previous
    ? [{ ...node }, ...getPath(node.previous)]
    : [{ ...node }];
};

const pathFind = async (startNode: Cell, goalNode: Cell): Promise<string> => {
  const fringe = [startNode];
  const explored: Cell[] = [];
  let thisNode;

  do {
    thisNode = fringe.shift();

    // Have we reached the goal?
    if (isSameLocation(thisNode, goalNode)) {
      const foundPath = getPath(thisNode);
      return `Found path of length ${foundPath.length}`;
    }

    // Mark as explored
    explored.push({ ...thisNode });

    const successorNodes = successors(thisNode);

    successorNodes.forEach((suc) => {
      if (explored.some((exploredNode) => isSameLocation(suc, exploredNode)))
        return;
      fringe.push(suc);
    });

    paintCells(walls, "#000");
    paintCells(paths, "#006");
    paintCells(explored, "#060");
    paintCells(fringe, "#ff0");
    paintCells(getPath(thisNode), "#f00");
    await new Promise((resolve) => setTimeout(resolve, 0));
  } while (fringe.length > 0 && fringe.length < 10000);

  return `Path not found`;
};

pathFind({ x: 1, y: 1, wall: false }, { x: 9, y: 4, wall: false }).then(
  (result) => {
    const output = document.getElementById("output");
    output.innerText = result;
  }
);
