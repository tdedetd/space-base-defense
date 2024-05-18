export class FpsMeter {
  private readonly valuesLimit = 30;
  private valuesMs: number[] = [];

  public registerFrame(ms: number): void {
    this.valuesMs.push(ms);
    if (this.valuesMs.length > this.valuesLimit) {
      this.valuesMs.shift();
    }
  }

  public getCurrent(): number {
    let totalMs = 0;
    let framesCount = 0;

    this.valuesMs.forEach((value) => {
      totalMs += value;
      framesCount++;
    });

    return totalMs === 0 ? 0 : framesCount / totalMs * 1000;
  }
}
