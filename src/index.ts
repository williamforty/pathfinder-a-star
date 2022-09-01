import { Cell, maze, paintCells } from "./grid";

const walls = maze.flat().filter(({ wall }) => wall);
const paths = maze.flat().filter(({ wall }) => !wall);

interface Node extends Cell {
  previous?: Node;
  totalCost?: number;
  heuristic?: number;
}

const getNode = (x: number, y: number) => {
  if (x < 0 || x >= maze[0].length || y < 0 || y >= maze.length) {
    // Out of bounds
    return null;
  }
  return { ...maze[y][x] };
};

const heuristicManhatten = (source: Node, target: Node) => {
  return Math.abs(source.x - target.x) + Math.abs(source.y - target.y);
};

const successors = (currentNode: Node, goalNode: Node): Node[] => {
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
    totalCost: (currentNode.totalCost || 0) + 1,
    heuristic: heuristicManhatten(currentNode, goalNode),
  }));
};

const isSameLocation = (source: Cell, target: Cell) => {
  return source.x === target.x && source.y === target.y;
};

const isNodeBetter = (source: Node, target: Node) => {
  return (
    source.totalCost + source.heuristic < target.totalCost + target.heuristic ||
    (source.totalCost + source.heuristic ===
      target.totalCost + target.heuristic &&
      source.heuristic < target.heuristic)
  );
};

const getPath = (node: Node): Node[] => {
  return node.previous
    ? [{ ...node }, ...getPath(node.previous)]
    : [{ ...node }];
};

const paintScene = (
  walls: Node[],
  paths: Node[],
  explored: Node[],
  fringe: Node[],
  path: Node[]
) => {
  paintCells(walls, "#000");
  paintCells(paths, "#006");
  paintCells(explored, "#060");
  paintCells(fringe, "#ff0", 1);
  paintCells(path, "#f00", 1);
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
      paintScene(walls, paths, explored, fringe, foundPath);
      return `Found path of length ${foundPath.length}`;
    }

    // Mark as explored
    explored.push({ ...thisNode });

    const successorNodes = successors(thisNode, goalNode);

    successorNodes.forEach((suc) => {
      if (
        [...explored, ...fringe].some((exploredNode) =>
          isSameLocation(suc, exploredNode)
        )
      )
        return;
      for (let i = 0; i < fringe.length; i++) {
        if (isNodeBetter(suc, fringe[i])) {
          fringe.splice(i, 0, suc);
          return;
        }
      }
      fringe.push(suc);
    });

    paintScene(walls, paths, explored, fringe, [
      ...getPath(thisNode),
      goalNode,
    ]);
    await new Promise((resolve) => setTimeout(resolve, 0));
  } while (fringe.length > 0 && fringe.length < 10000);

  return `Path not found`;
};

pathFind(
  { x: 1, y: 1, wall: false },
  { x: maze[0].length - 2, y: maze.length - 2, wall: false }
).then((result) => {
  const output = document.getElementById("output");
  output.innerText = result;
});
