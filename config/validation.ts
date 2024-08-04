export function pathMatcher(path: string, pathToMatch: string[]): boolean {
  const regexMatchers = pathToMatch.map((pattern) => {
    const regexPattern = pattern.replace(/\/:path\*/g, '(/.*)?');
    return new RegExp(`^${regexPattern}$`);
  });

  return regexMatchers.some((regex) => regex.test(path));
}
