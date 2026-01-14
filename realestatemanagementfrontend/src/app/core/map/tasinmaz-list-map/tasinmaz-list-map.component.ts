import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { GeoJSON } from 'ol/format';
import { Style, Stroke, Fill } from 'ol/style';
import Icon from 'ol/style/Icon';
import { getCenter } from 'ol/extent';

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

  /** Polygonların görünmeye başlayacağı zoom */
  private readonly POLYGON_ZOOM_THRESHOLD = 10;

  /** PIN STYLE (tek yerde tanımlı – performanslı) */
  private readonly pinStyle = new Style({
    image: new Icon({
      src: 'assets/icons/pin.svg', // ⬅ mutlaka src/assets/icons altında olsun
      scale: 0.2,
      anchor: [0.5, 1],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
    }),
  });

  /** POLYGON STYLE */
  private readonly polygonStyle = new Style({
    stroke: new Stroke({
      color: '#d90429',
      width: 3,
    }),
    fill: new Fill({
      color: 'rgba(217, 4, 41, 0.25)',
    }),
  });

  vectorLayer = new VectorLayer({
    source: this.vectorSource,
    style: (feature) => {
      const zoom = this.map?.getView().getZoom() ?? 0;
      const type = feature.getGeometry()?.getType();

      // 🔹 POINT → her zaman PIN
      if (type === 'Point') {
        return this.pinStyle;
      }

      // 🔹 POLYGON → sadece yakın zoomda
      if (
        (type === 'Polygon' || type === 'MultiPolygon') &&
        zoom >= this.POLYGON_ZOOM_THRESHOLD
      ) {
        return this.polygonStyle;
      }

      return undefined;
    },
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

  private initMap(): void {
    this.map = new Map({
      target: 'list-map',
      layers: [
        new TileLayer({ source: new OSM() }),
        this.vectorLayer,
      ],
      view: new View({
        center: [3900000, 4750000], // Türkiye
        zoom: 6,
      }),
    });

    // 🔁 Zoom değişince style yeniden hesapla
    this.map.getView().on('change:resolution', () => {
      this.vectorLayer.changed();
    });
  }

  private drawTasinmazlar(): void {
    const format = new GeoJSON();
    this.vectorSource.clear();

    const extents: number[][] = [];

    this.tasinmazlar.forEach((t) => {
      if (!t.koordinat) return;

      try {
        const geojson = JSON.parse(t.koordinat);

        // 🔹 POLYGON
        const polygonFeature = format.readFeature(geojson, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
        });

        this.vectorSource.addFeature(polygonFeature);
        extents.push(polygonFeature.getGeometry()!.getExtent());

        // 🔹 POLYGON MERKEZİNE PIN
        const center = getCenter(
          polygonFeature.getGeometry()!.getExtent()
        );

        const pointFeature = format.readFeature({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: center,
          },
        });

        this.vectorSource.addFeature(pointFeature);

      } catch (err) {
        console.warn('Geçersiz koordinat:', err);
      }
    });

    // 🔹 Tüm taşınmazlara odaklan
    if (extents.length > 0) {
      this.map.getView().fit(
        [
          Math.min(...extents.map(e => e[0])),
          Math.min(...extents.map(e => e[1])),
          Math.max(...extents.map(e => e[2])),
          Math.max(...extents.map(e => e[3])),
        ],
        {
          padding: [40, 40, 40, 40],
          maxZoom: 14,
          duration: 600,
        }
      );
    }
  }
}
