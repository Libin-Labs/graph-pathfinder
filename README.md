# @lp-labs/graph-pathfinder

Bounded Dijkstra shortest paths for finite directed nonnegative graphs. Zero runtime and peer dependencies. MIT. Node.js 18+; ES2022-compatible browser runtimes with BigInt where used. No browser globals accessed at import.

## Install

```sh
npm install @lp-labs/graph-pathfinder
```

## Quick start

```js
import { shortestPath } from '@lp-labs/graph-pathfinder';
console.log(
  shortestPath(
    3,
    [
      { from: 0, to: 1, cost: 4 },
      { from: 0, to: 2, cost: 1 },
      { from: 2, to: 1, cost: 1 },
    ],
    0,
    1,
  ),
); // distance 2, path [0,2,1]
```

ES modules use named imports above. CommonJS uses `const { shortestPath } = require('@lp-labs/graph-pathfinder');`. Both formats ship declarations.

## Public API and customization

- `Edge`: `{from,to,cost}`; vertices are integer indices.
- `PathOptions`: `maxWork?` defaults to 10,000,000 (maximum 100,000,000).
- `PathResult`: `distance: number | null`, `path: number[]`, `settled: number`.
- `shortestPath(vertexCount, edges, start, target, options?): PathResult`. Directed edges, parallel edges and self loops supported. Null distance and empty path mean unreachable. Equal distances keep first predecessor; vertex scans break ties by index.

All runtime exports and public declaration types are listed above. Options are per call/instance; no global configuration.

## Errors, ownership and limits

Dijkstra uses O(V²+E) time and O(V+E) memory, no heuristic assumptions. Bounds: 1..10,000 vertices, at most 1,000,000 edges. Work counts each vertex scan and edge relaxation after input validation (validation itself O(E)). RangeError for invalid indices, limits, negative/nonfinite costs, exceeded work or encountered cost overflow. Finite-double rounding applies; costs are not exact decimal arithmetic. Input is copied, result arrays are fresh.

Algorithms are synchronous and CPU/memory bounded by the stated limits, not cancellable or real-time. Validation does not sandbox hostile getters, proxies, callbacks or infinite iterables. TypeScript signatures are the supported input contract. No I/O, network, persistence or cryptographic guarantees.

## Development

```sh
npm ci --offline
npm run build
npm run typecheck
npm test
npm run format:check
```

Strict TypeScript, ESM/CommonJS, bare installed-package consumers with negative type assertions, and deterministic reference-oracle tests are included. Only TypeScript and Prettier are development dependencies.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
