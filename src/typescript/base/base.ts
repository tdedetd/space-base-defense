import { Rectangle } from '../models/geometry/rectangle.interface';
import { BaseModule } from './base-module';

export class Base {
  private _modules: BaseModule[];

  public get modules(): BaseModule[] {
    return this._modules;
  }

  constructor(modules: BaseModule[]) {
    this._modules = modules;
  }

  public getBorders(): Rectangle {
    let minX = 99999999;
    let minY = 99999999;
    let maxX = 0;
    let maxY = 0;

    this.modules.forEach(({ rectangle }) => {
      minX = rectangle.x < minX ? rectangle.x : minX;
      minY = rectangle.y < minY ? rectangle.y : minY;

      const moduleMaxX = rectangle.x + rectangle.width;
      maxX = moduleMaxX > maxX ? moduleMaxX : maxX;

      const moduleMaxY = rectangle.y + rectangle.height;
      maxY = moduleMaxY > maxY ? moduleMaxY : maxY;
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  public getUndestroyedModules(): BaseModule[] {
    return this._modules.filter(({ destroyed }) => !destroyed);
  }
}
