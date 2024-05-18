import { GameMainLayerRenderer } from '../layer-renderer/game-main-layer-renderer';
import { GameMainStaticLayerRenderer } from '../layer-renderer/game-main-static-layer-renderer';

export interface LayerRenderers {
  main: GameMainLayerRenderer,
  mainStatic: GameMainStaticLayerRenderer,
}
