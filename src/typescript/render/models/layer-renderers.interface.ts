import { EffectsLayerRenderer } from '../layer-renderer/effects-layer-renderer';
import { GameMainLayerRenderer } from '../layer-renderer/game-main-layer-renderer';
import { GameMainStaticLayerRenderer } from '../layer-renderer/game-main-static-layer-renderer';

export interface LayerRenderers {
  effects: EffectsLayerRenderer;
  main: GameMainLayerRenderer;
  mainStatic: GameMainStaticLayerRenderer;
}
