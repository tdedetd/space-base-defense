import { Point } from './models/geometry/point.intarface';
import { Rectangle } from './models/geometry/rectangle.interface';

export class Measures {
  private _sceneWidth = 0;
  private _sceneHeight = 0;

  private _sceneWidthPx = 0;
  private _sceneHeightPx = 0;

  private _sceneYStartPx = 0;
  private _sceneOriginPx: Point = { x: 0, y: 0 };

  public get sceneWidth(): number {
    return this._sceneWidth;
  }

  public get sceneHeight(): number {
    return this._sceneHeight;
  }

  public get sceneWidthPx(): number {
    return this._sceneWidthPx;
  }

  public get sceneHeightPx(): number {
    return this._sceneHeightPx;
  }

  public get sceneYStartPx(): number {
    return this._sceneYStartPx;
  }

  public get sceneOriginPx(): Point {
    return this._sceneOriginPx;
  }

  constructor(private readonly aspectRatio: number, sceneWidth: number) {
    this.updateSceneSizes(sceneWidth);
  }

  public convertPointToPx(scenePoint: Point): Point {
    return {
      x: this.sceneOriginPx.x + (scenePoint.x / this.sceneWidth * this.sceneWidthPx),
      y: this.sceneYStartPx - (scenePoint.y / this.sceneHeight * this.sceneHeightPx),
    };
  }

  public convertRectangleToPx(sceneRectangle: Rectangle): Rectangle {
    const startPoint = this.convertPointToPx({
      x: sceneRectangle.x,
      y: sceneRectangle.y
    });

    const height = this.sceneHeightPx / this.sceneHeight * sceneRectangle.height;
    return {
      x: startPoint.x,
      y: startPoint.y - height,
      width: this.sceneWidthPx / this.sceneWidth * sceneRectangle.width,
      height: height,
    };
  }

  public convertPointToScenePoint(pointPx: Point): Point {
    return {
      x: (pointPx.x - this.sceneOriginPx.x) / this.sceneWidthPx * this.sceneWidth,
      y: (this.sceneYStartPx - pointPx.y) / this.sceneHeightPx * this.sceneHeight,
    };
  }

  public update(widthPx: number, heightPx: number): void {
    this.updateSceneBorders(widthPx, heightPx);
    this._sceneYStartPx = this._sceneOriginPx.y + this._sceneHeightPx;
  }

  private updateSceneBorders(widthPx: number, heightPx: number): void {
    if (widthPx * this.aspectRatio < heightPx) {
      this._sceneWidthPx = widthPx;
      this._sceneHeightPx = Math.round(widthPx * this.aspectRatio);
      this._sceneOriginPx = {
        x: 0,
        y: Math.round(heightPx / 2 - this._sceneHeightPx / 2),
      };
    } else {
      this._sceneWidthPx = Math.round(heightPx / this.aspectRatio);
      this._sceneHeightPx = heightPx;
      this._sceneOriginPx = {
        x: Math.round(widthPx / 2 - this.sceneWidthPx / 2),
        y: 0,
      };
    }
  }

  private updateSceneSizes(width: number): void {
    this._sceneWidth = width;
    this._sceneHeight = width * this.aspectRatio;
  }
}
