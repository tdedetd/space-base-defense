import { Rectangle } from './models/geometry/rectangle.interface';

export class BaseModule {
  private _destroyed = false;
  private readonly _rectangle: Rectangle;

  public get destroyed(): boolean {
    return this._destroyed;
  }

  public get rectangle(): Rectangle {
    return this._rectangle;
  }

  constructor(rectangle: Rectangle) {
    this._rectangle = rectangle;
  }
}
