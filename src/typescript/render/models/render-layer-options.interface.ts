import { Point } from 'line-intersect';

export interface RenderLayerOptions {
  activeScenePosition: Point | null;
  msDiff: number;
  pause: boolean;
}
