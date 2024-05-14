export class GameStatistics {
  private _enemyProjectiles = 0;
  private _shots = 0;

  public get enemyProjectiles(): number {
    return this._enemyProjectiles;
  }

  public get shots(): number {
    return this._shots;
  }

  public addEnemyProjectiles(count = 1): void {
    this._enemyProjectiles += count;
  }

  public addShots(count = 1): void {
    this._shots += count;
  }
}
