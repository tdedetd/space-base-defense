export class GameInterval {
  private msCounter = 0;

  constructor(
    private readonly callback: () => void,
    private readonly intervalMs: number,
  ) {}

  public update(ms: number): void {
    this.msCounter += ms;
    if (this.msCounter / this.intervalMs >= 1) {
      this.msCounter %= this.intervalMs;
      this.callback();
    }
  }
}
