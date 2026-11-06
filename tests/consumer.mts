import {
  shortestPath,
  type Edge,
  type PathOptions,
  type PathResult,
} from '@lp-labs/graph-pathfinder';
export type PublicTypes = [Edge, PathOptions, PathResult];
void shortestPath;
const result: PathResult = shortestPath(2, [{ from: 0, to: 1, cost: 2 }], 0, 1);
void result;
// @ts-expect-error costs are numbers
shortestPath(2, [{ from: 0, to: 1, cost: '2' }], 0, 1);
