import { describe, expect, it } from 'vitest';
import { pathMatcher } from '../utils';

describe('pathMatcher', () => {
  const pathToMatch = ['/example/:path*'];

  const testCases = [
    { input: '/example', output: true },
    { input: '/example/', output: true },
    { input: '/example/test', output: true },
    { input: '/example/test/', output: true },
    { input: '/example/123', output: true },
    { input: '/', output: false },
    { input: '/examples', output: false },
    { input: '/exampletest', output: false },
    { input: '/sample/example', output: false },
    { input: 'example/', output: false },
  ];

  testCases.forEach(({ input, output }) => {
    it(`matches '${input}' should be ${output}`, () => {
      expect(pathMatcher(input, pathToMatch)).toBe(output);
    });
  });
});
