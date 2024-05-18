import { LayerRenderers } from './layer-renderers.interface';

export type CanvasesMap = Record<keyof LayerRenderers, HTMLCanvasElement>;
