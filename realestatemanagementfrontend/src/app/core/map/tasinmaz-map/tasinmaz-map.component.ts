import {
  Component,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Icon } from 'ol/style';
import { toLonLat } from 'ol/proj';

@Component({
  selector: 'app-tasinmaz-map',
  templateUrl: './tasinmaz-map.component.html',
  styleUrls: ['./tasinmaz-map.component.css'],
})
export class TasinmazMapComponent implements AfterViewInit, OnChanges {
  @Input() tasinmazlar: any[] = [];

  map!: Map;
  vectorSource = new VectorSource();

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasinmazlar'] && this.map) {
      this.drawMarkers();
    }
  }

  private initMap(): void {
    const vectorLayer = new VectorLayer({
      source: this.vectorSource,
    });

    this.map = new Map({
      target: 'map',
      layers: [new TileLayer({ source: new OSM() }), vectorLayer],
      view: new View({
        center: fromLonLat([32.85411, 39.92077]),
        zoom: 6,
      }),
    });
    this.map.on('click', (event) => {
      const coordinate = event.coordinate;
      const [lon, lat] = toLonLat(coordinate);

      console.log('LAT:', lat);
      console.log('LON:', lon);
    });
  }

  private drawMarkers(): void {
    this.vectorSource.clear();

    this.tasinmazlar.forEach((t) => {
      if (!t.koordinat) return;

      const [lat, lon] = t.koordinat.split(',').map(Number);
      if (isNaN(lat) || isNaN(lon)) return;

      const feature = new Feature({
        geometry: new Point(fromLonLat([lon, lat])),
      });

      feature.setStyle(
        new Style({
          image: new Icon({
            src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
            scale: 0.05,
          }),
        })
      );

      this.vectorSource.addFeature(feature);
    });
  }
}
