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
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import ScaleLine from 'ol/control/ScaleLine';

@Component({
  selector: 'app-tasinmaz-list-map',
  templateUrl: './tasinmaz-list-map.component.html',
  styleUrls: ['./tasinmaz-list-map.component.css'],
})
export class TasinmazListMapComponent implements AfterViewInit, OnChanges {
  @Input() tasinmazlar: any[] = [];

  map!: Map;

  baseLayer!: TileLayer<OSM>;
  baseOpacity = 1;

  vectorSource = new VectorSource();
  vectorLayer!: VectorLayer<VectorSource>;

  tooltipVisible = false;
  tooltipText = '';
  canCalculate = false;

  private readonly POLYGON_ZOOM_THRESHOLD = 10;

  private readonly pinStyle = new Style({
    image: new Icon({
      src: 'assets/icons/pin.svg',
      scale: 0.2,
      anchor: [0.5, 1],
    }),
  });

  private readonly polygonStyle = new Style({
    stroke: new Stroke({
      color: '#d90429',
      width: 3,
    }),
    fill: new Fill({
      color: 'rgba(217, 4, 41, 0.25)',
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

  onBaseOpacityChange(): void {
    this.baseLayer.setOpacity(this.baseOpacity);

    this.vectorLayer.setOpacity(this.baseOpacity);
  }
  calculateUnion(): void {
    console.log('Union (A ∪ B) clicked');
  }

  calculateIntersection(): void {
    console.log('Intersection (A ∩ B) clicked');
  }

  private initMap(): void {
    this.baseLayer = new TileLayer({
      source: new OSM(),
      opacity: this.baseOpacity,
    });

    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: (feature) => {
        const zoom = this.map?.getView().getZoom() ?? 0;
        const type = feature.getGeometry()?.getType();

        if (type === 'Point') {
          return this.pinStyle;
        }

        if (
          (type === 'Polygon' || type === 'MultiPolygon') &&
          zoom >= this.POLYGON_ZOOM_THRESHOLD
        ) {
          return this.polygonStyle;
        }

        return undefined;
      },
    });

    this.map = new Map({
      target: 'list-map',
      layers: [this.baseLayer, this.vectorLayer],
      view: new View({
        center: [3900000, 4750000],
        zoom: 6,
      }),
      controls: [
        new ScaleLine({
          units: 'metric',
          bar: true,
          steps: 4,
          text: true,
          minWidth: 100,
        }),
      ],
    });

    const tooltipEl = document.getElementById('map-tooltip') as HTMLElement;

    this.map.on('pointermove', (evt) => {
      const feature = this.map.forEachFeatureAtPixel(evt.pixel, (f) => f, {
        hitTolerance: 6,
      });

      if (feature && feature.getGeometry()?.getType() === 'Point') {
        const adSoyad = feature.get('adSoyad');

        if (adSoyad) {
          this.tooltipText = adSoyad;
          this.tooltipVisible = true;

          tooltipEl.style.left = evt.pixel[0] + 'px';
          tooltipEl.style.top = evt.pixel[1] + 'px';
          return;
        }
      }

      this.tooltipVisible = false;
    });
  }

  private drawTasinmazlar(): void {
  const format = new GeoJSON();
  this.vectorSource.clear();

  const extents: number[][] = [];

  for (const t of this.tasinmazlar) { 
    if (!t.koordinat) continue;

    try {
      const geojson = JSON.parse(t.koordinat);

      const polygonFeature = format.readFeature(geojson, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      });

      this.vectorSource.addFeature(polygonFeature);
      extents.push(polygonFeature.getGeometry()!.getExtent());

      const center = getCenter(polygonFeature.getGeometry()!.getExtent());

      const pointFeature = new Feature({
        geometry: new Point(center),
      });

      pointFeature.set('adSoyad', t.adSoyad);
      this.vectorSource.addFeature(pointFeature);
    } catch (err) {
      console.warn('Geçersiz koordinat:', err);
    }
  }

  if (extents.length > 0) {
    this.map.getView().fit(
      [
        Math.min(...extents.map((e) => e[0])),
        Math.min(...extents.map((e) => e[1])),
        Math.max(...extents.map((e) => e[2])),
        Math.max(...extents.map((e) => e[3])),
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
