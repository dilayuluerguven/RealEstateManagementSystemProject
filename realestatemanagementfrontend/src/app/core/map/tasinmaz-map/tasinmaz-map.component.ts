import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import Draw from 'ol/interaction/Draw';
import { GeoJSON } from 'ol/format';

@Component({
  selector: 'app-tasinmaz-map',
  templateUrl: './tasinmaz-map.component.html',
  styleUrls: ['./tasinmaz-map.component.css'],
})
export class TasinmazMapComponent
  implements AfterViewInit, OnChanges {

  @Input() initialGeometry?: string;
  @Output() geometryCreated = new EventEmitter<any>();

  map!: Map;

  vectorSource = new VectorSource();
  vectorLayer = new VectorLayer({
    source: this.vectorSource,
  });

  draw?: Draw;

  ngAfterViewInit(): void {
    this.initMap();

    setTimeout(() => {
      this.map.updateSize();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['initialGeometry'] &&
      changes['initialGeometry'].currentValue &&
      this.map
    ) {
      this.drawExistingGeometry(
        changes['initialGeometry'].currentValue
      );
    }
  }

  initMap(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        this.vectorLayer,
      ],
      view: new View({
        center: [3900000, 4750000], 
        zoom: 6,
      }),
    });
  }

  drawExistingGeometry(geoJsonString: string): void {
    const format = new GeoJSON();

    const feature = format.readFeature(
      JSON.parse(geoJsonString),
      {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      }
    );

    this.vectorSource.clear();
    this.vectorSource.addFeature(feature);
  }

  startDraw(type: 'Point' | 'LineString' | 'Polygon'): void {
    if (this.draw) {
      this.map.removeInteraction(this.draw);
    }

    this.draw = new Draw({
      source: this.vectorSource,
      type,
    });

    this.draw.on('drawstart', () => {
      this.vectorSource.clear();
    });

    this.draw.on('drawend', (event) => {
      const geoJson = new GeoJSON().writeFeatureObject(
        event.feature,
        {
          featureProjection: 'EPSG:3857',
          dataProjection: 'EPSG:4326',
        }
      );

      this.geometryCreated.emit(geoJson);
    });

    this.map.addInteraction(this.draw);
  }
}
