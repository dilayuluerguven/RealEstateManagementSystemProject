import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import Draw from 'ol/interaction/Draw';
import { GeoJSON } from 'ol/format';

import { MapHelperService } from '../../shared/services/map-helper.service';

@Component({
  selector: 'app-tasinmaz-map',
  templateUrl: './tasinmaz-map.component.html',
  styleUrls: ['./tasinmaz-map.component.css'],
})
export class TasinmazMapComponent implements AfterViewInit, OnChanges {
  @Input() initialGeometry?: string;
  @Input() opacity: number = 1;
  @Output() geometryCreated = new EventEmitter<any>();

  map!: Map;

  baseLayer!: TileLayer<OSM>;

  vectorSource = new VectorSource();
  vectorLayer = new VectorLayer({
    source: this.vectorSource,
  });

  draw?: Draw;

  constructor(private mapHelper: MapHelperService) {}

  ngAfterViewInit(): void {
    this.initMap();

    if (this.initialGeometry) {
      this.drawExistingGeometry(this.initialGeometry);
    }

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
    this.drawExistingGeometry(changes['initialGeometry'].currentValue);
  }

  if (changes['opacity'] && this.map) {
    this.mapHelper.setAllLayersOpacity(
      this.map,
      changes['opacity'].currentValue
    );
  }
}


  initMap(): void {
    this.baseLayer = new TileLayer({
      source: new OSM(),
      opacity: this.opacity,
    });

    this.map = new Map({
      target: 'map',
      layers: [
        this.baseLayer,
        this.vectorLayer,
      ],
      view: new View({
        center: [3900000, 4750000],
        zoom: 6,
      }),
    });

    this.mapHelper.addScale(this.map);
  }

  drawExistingGeometry(geoJsonString: string): void {
    const format = new GeoJSON();

    const feature = format.readFeature(JSON.parse(geoJsonString), {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    });

    this.vectorSource.clear();
    this.vectorSource.addFeature(feature);

    const extent = this.vectorSource.getExtent();
    this.map.getView().fit(extent, {
      padding: [40, 40, 40, 40],
      maxZoom: 17,
      duration: 500,
    });
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
      const geoJson = new GeoJSON().writeFeatureObject(event.feature, {
        featureProjection: 'EPSG:3857',
        dataProjection: 'EPSG:4326',
      });

      this.geometryCreated.emit(geoJson);
    });

    this.map.addInteraction(this.draw);
  }
}
