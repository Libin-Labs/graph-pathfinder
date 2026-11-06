export interface Edge {
  from: number;
  to: number;
  cost: number;
}
export interface PathOptions {
  maxWork?: number;
}
export interface PathResult {
  distance: number | null;
  path: number[];
  settled: number;
}
export function shortestPath(
  vertexCount: number,
  edges: readonly Edge[],
  start: number,
  target: number,
  options: PathOptions = {},
): PathResult {
  if (!Number.isSafeInteger(vertexCount) || vertexCount < 1 || vertexCount > 10000)
    throw new RangeError('Invalid vertexCount');
  const vertex = (v: number): void => {
    if (!Number.isSafeInteger(v) || v < 0 || v >= vertexCount)
      throw new RangeError('Invalid vertex');
  };
  vertex(start);
  vertex(target);
  const maxWork = options.maxWork ?? 10000000;
  if (!Number.isSafeInteger(maxWork) || maxWork < 1 || maxWork > 100000000)
    throw new RangeError('Invalid maxWork');
  if (!Array.isArray(edges) || edges.length > 1000000) throw new RangeError('Invalid edges');
  const adjacency: { to: number; cost: number }[][] = Array.from({ length: vertexCount }, () => []);
  for (const edge of edges) {
    vertex(edge.from);
    vertex(edge.to);
    if (!Number.isFinite(edge.cost) || edge.cost < 0)
      throw new RangeError('Costs must be finite and nonnegative');
    adjacency[edge.from]!.push({ to: edge.to, cost: edge.cost });
  }
  const distance = Array<number>(vertexCount).fill(Infinity),
    previous = Array<number>(vertexCount).fill(-1),
    done = Array<boolean>(vertexCount).fill(false);
  distance[start] = 0;
  let work = 0,
    settled = 0;
  const tick = (): void => {
    if (++work > maxWork) throw new RangeError('Work limit exceeded');
  };
  while (true) {
    let best = -1;
    for (let i = 0; i < vertexCount; i++) {
      tick();
      if (!done[i] && distance[i]! < Infinity && (best < 0 || distance[i]! < distance[best]!))
        best = i;
    }
    if (best < 0) return { distance: null, path: [], settled };
    done[best] = true;
    settled++;
    if (best === target) break;
    for (const edge of adjacency[best]!) {
      tick();
      const candidate = distance[best]! + edge.cost;
      if (!Number.isFinite(candidate)) throw new RangeError('Path cost overflow');
      if (!done[edge.to] && candidate < distance[edge.to]!) {
        distance[edge.to] = candidate;
        previous[edge.to] = best;
      }
    }
  }
  const path = [target];
  while (path[path.length - 1] !== start) path.push(previous[path[path.length - 1]!]!);
  path.reverse();
  return { distance: distance[target]!, path, settled };
}
