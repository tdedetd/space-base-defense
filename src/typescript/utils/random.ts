export class Random {
  public static integer(to: number): number {
    return Math.floor(Random.to(to));
  }

  public static interval(from: number, to: number): number {
    return Math.random() * (to - from) + from;
  }

  public static to(to: number): number {
    return Random.interval(0, to);
  }
}
