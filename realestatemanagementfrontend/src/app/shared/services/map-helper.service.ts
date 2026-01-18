import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import ScaleLine from 'ol/control/ScaleLine';

@Injectable({ providedIn: 'root' })
export class MapHelperService {

  addScale(map: Map): void {
    map.addControl(
      new ScaleLine({
        units: 'metric',
        bar: true,
        steps: 4,
        text: true
      })
    );
  }

  setAllLayersOpacity(map: Map, opacity: number): void {
    map.getLayers().forEach((layer: any) => {
      if (layer instanceof TileLayer || layer.setOpacity) {
        layer.setOpacity(opacity);
      }
    });
  }
}
