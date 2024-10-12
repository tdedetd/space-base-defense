export function getQuadraticEquationSolution(a: number, b: number, c: number): number[] {
  const discriminant = b * b - 4 * a * c;

  return discriminant === 0
    ? [-b / 2 / a]
    : discriminant > 0
    ? [(-b + Math.sqrt(discriminant)) / 2 / a, (-b - Math.sqrt(discriminant)) / 2 / a]
    : [];
}
