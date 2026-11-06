import test from 'node:test';
import assert from 'node:assert/strict';
import * as lib from '../dist/esm/index.js';
function random(seed = 123456789) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
test('directed weighted path reconstruction', () => {
  const edges = [
    { from: 0, to: 1, cost: 8 },
    { from: 0, to: 2, cost: 2 },
    { from: 2, to: 1, cost: 1 },
  ];
  assert.deepEqual(lib.shortestPath(3, edges, 0, 1).path, [0, 2, 1]);
  assert.equal(lib.shortestPath(3, edges, 0, 1).distance, 3);
});
test('unreachable and identity', () => {
  assert.equal(lib.shortestPath(2, [], 0, 1).distance, null);
  assert.deepEqual(lib.shortestPath(2, [], 1, 1).path, [1]);
});
test('zero cycles and parallel edges', () => {
  const e = [
    { from: 0, to: 1, cost: 0 },
    { from: 1, to: 0, cost: 0 },
    { from: 1, to: 2, cost: 8 },
    { from: 1, to: 2, cost: 2 },
  ];
  assert.equal(lib.shortestPath(3, e, 0, 2).distance, 2);
});
test('input and work bounds', () => {
  assert.throws(() => lib.shortestPath(0, [], 0, 0), RangeError);
  assert.throws(() => lib.shortestPath(2, [{ from: 0, to: 1, cost: -1 }], 0, 1), RangeError);
  assert.throws(() => lib.shortestPath(2, [], 0, 1, { maxWork: 1 }), RangeError);
  assert.throws(() => lib.shortestPath(2, [], 0, 2), RangeError);
});
test('overflow and deterministic ties', () => {
  assert.throws(
    () =>
      lib.shortestPath(
        3,
        [
          { from: 0, to: 1, cost: Number.MAX_VALUE },
          { from: 1, to: 2, cost: Number.MAX_VALUE },
        ],
        0,
        2,
      ),
    RangeError,
  );
  assert.deepEqual(
    lib.shortestPath(
      4,
      [
        { from: 0, to: 2, cost: 1 },
        { from: 0, to: 1, cost: 1 },
        { from: 1, to: 3, cost: 1 },
        { from: 2, to: 3, cost: 1 },
      ],
      0,
      3,
    ).path,
    [0, 1, 3],
  );
});
test('seeded Floyd-Warshall oracle and valid paths', () => {
  const rng = random();
  for (let t = 0; t < 60; t++) {
    const n = 6,
      e = [],
      d = Array.from({ length: n }, (_, i) =>
        Array.from({ length: n }, (_, j) => (i === j ? 0 : Infinity)),
      );
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (rng() < 0.3) {
          const cost = Math.floor(rng() * 8);
          e.push({ from: i, to: j, cost });
          d[i][j] = Math.min(d[i][j], cost);
        }
    for (let k = 0; k < n; k++)
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) d[i][j] = Math.min(d[i][j], d[i][k] + d[k][j]);
    for (let a = 0; a < n; a++)
      for (let b = 0; b < n; b++) {
        const r = lib.shortestPath(n, e, a, b);
        assert.equal(r.distance, Number.isFinite(d[a][b]) ? d[a][b] : null);
        if (r.path.length) {
          let cost = 0;
          for (let i = 1; i < r.path.length; i++)
            cost += Math.min(
              ...e.filter((x) => x.from === r.path[i - 1] && x.to === r.path[i]).map((x) => x.cost),
            );
          assert.equal(cost, r.distance);
        }
      }
  }
});
