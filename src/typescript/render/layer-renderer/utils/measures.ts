import { Point } from '../../../models/geometry/point.intarface';
import { Rectangle } from '../../../models/geometry/rectangle.interface';
import { defaultCamera } from '../../constants/default-camera';
import { Camera } from '../../models/camera.interface';

export class Measures {
  private _camera: Camera = defaultCamera;

  private _sceneWidth = 0;
  private _sceneHeight = 0;

  private _sceneWidthPx = 0;
  private _sceneHeightPx = 0;

  private _sceneOriginPx: Point = { x: 0, y: 0 };
  private _sceneYStartPx = 0;

  public get sceneWidth(): number {
    return this._sceneWidth;
  }

  public get sceneHeight(): number {
    return this._sceneHeight;
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

  public convertSizeToPx(size: number): number {
    return this._sceneWidthPx / this.sceneWidth * this._camera.zoom * size;
  }

  public convertPointToPx(scenePoint: Point): Point {
    return {
      x: this.sceneOriginPx.x
        + ((scenePoint.x - this._camera.position.x) / this.sceneWidth * this._sceneWidthPx)
        * this._camera.zoom,
      y: this.sceneYStartPx
        - ((scenePoint.y - this._camera.position.y) / this.sceneHeight * this._sceneHeightPx)
        * this._camera.zoom,
    };
  }

  public convertRectangleToPx(sceneRectangle: Rectangle): Rectangle {
    const startPoint = this.convertPointToPx({
      x: sceneRectangle.x,
      y: sceneRectangle.y
    });

    const height = this._sceneHeightPx / this.sceneHeight * sceneRectangle.height;
    return {
      x: startPoint.x,
      y: startPoint.y - height * this._camera.zoom,
      width: this._sceneWidthPx / this.sceneWidth * sceneRectangle.width * this._camera.zoom,
      height: height * this._camera.zoom,
    };
  }

  public convertPointPxToScenePoint(pointPx: Point): Point {
    const x = (pointPx.x - this._sceneOriginPx.x)
      / this._sceneWidthPx * this._sceneWidth
      / this._camera.zoom + this._camera.position.x;

    const y = (this._sceneYStartPx - pointPx.y)
      / this._sceneHeightPx * this._sceneHeight
      / this._camera.zoom + this._camera.position.y;

    return { x, y };
  }

  public getSceneBorders(): Rectangle {
    const x = -this.sceneOriginPx.x * (this.sceneWidth / this._sceneWidthPx);
    const y = -this.sceneOriginPx.y * (this.sceneHeight / this._sceneHeightPx);

    return {
      x,
      y,
      width: this.sceneWidth + (-x * 2),
      height: this.sceneHeight + (-y * 2),
    };
  }

  public update(widthPx: number, heightPx: number): void {
    this.updateSceneBorders(widthPx, heightPx);
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
        x: Math.round(widthPx / 2 - this._sceneWidthPx / 2),
        y: 0,
      };
    }
    this._sceneYStartPx = this._sceneOriginPx.y + this._sceneHeightPx;
  }

  private updateSceneSizes(width: number): void {
    this._sceneWidth = width;
    this._sceneHeight = width * this.aspectRatio;
  }
}
