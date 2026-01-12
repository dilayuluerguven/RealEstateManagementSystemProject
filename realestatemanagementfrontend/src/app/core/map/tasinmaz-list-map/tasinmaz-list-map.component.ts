import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { GeoJSON } from 'ol/format';
import { Style, Stroke, Fill, Circle as CircleStyle } from 'ol/style';
import { boundingExtent } from 'ol/extent';

@Component({
  selector: 'app-tasinmaz-list-map',
  templateUrl: './tasinmaz-list-map.component.html',
  styleUrls: ['./tasinmaz-list-map.component.css'],
})
export class TasinmazListMapComponent
  implements AfterViewInit, OnChanges {

  @Input() tasinmazlar: any[] = [];

  map!: Map;
  vectorSource = new VectorSource();

  vectorLayer = new VectorLayer({
    source: this.vectorSource,
    style: new Style({
      stroke: new Stroke({
        color: '#d90429',   
        width: 3,
      }),
      fill: new Fill({
        color: 'rgba(217, 4, 41, 0.25)', 
      }),
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({ color: '#d90429' }),
        stroke: new Stroke({ color: '#fff', width: 2 }),
      }),
    }),
  });

  ngAfterViewInit(): void {
    this.initMap();

    setTimeout(() => {
      this.map.updateSize();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasinmazlar'] && this.map) {
      this.drawTasinmazlar();
    }
  }

  initMap(): void {
    this.map = new Map({
      target: 'list-map',
      layers: [
        new TileLayer({ source: new OSM() }),
        this.vectorLayer,
      ],
      view: new View({
        center: [3900000, 4750000],
        zoom: 6,
      }),
    });
  }

  drawTasinmazlar(): void {
    const format = new GeoJSON();
    this.vectorSource.clear();

    const extents: number[][] = [];

    this.tasinmazlar.forEach(t => {
      if (!t.koordinat) return;

      try {
        const feature = format.readFeature(
          JSON.parse(t.koordinat),
          {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
          }
        );

        this.vectorSource.addFeature(feature);
        extents.push(feature.getGeometry()!.getExtent());
      } catch {}
    });

    if (extents.length > 0) {
      const extent = boundingExtent(extents);
      this.map.getView().fit(extent, {
        padding: [40, 40, 40, 40],
        duration: 700,
        maxZoom: 17,
      });
    }
  }
}
