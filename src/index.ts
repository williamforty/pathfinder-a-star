import { maze, paintCells } from "./grid";

const walls = maze.flat().filter(({ wall }) => wall);
const paths = maze.flat().filter(({ wall }) => !wall);

paintCells(walls, "#f00");
paintCells(paths, "#fff");
