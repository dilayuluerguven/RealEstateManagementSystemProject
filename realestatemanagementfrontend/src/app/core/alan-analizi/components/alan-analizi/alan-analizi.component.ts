import { Component, AfterViewInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Draw from 'ol/interaction/Draw';
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';
import { transform } from 'ol/proj';

import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';

import { AlanAnalizService } from '../../services/alan-analizi.service';

@Component({
  selector: 'app-alan-analiz',
  templateUrl: './alan-analizi.component.html',
  styleUrls: ['./alan-analizi.component.css'],
})
export class AlanAnalizComponent implements AfterViewInit {
  geometriAdi: 'A' | 'B' | 'C' = 'A';
  sonuc: any;

  map!: Map;
  draw!: Draw;

  styleA = new Style({
    stroke: new Stroke({ color: '#2196F3', width: 3 }),
    fill: new Fill({ color: 'rgba(33,150,243,0.2)' }),
  });

  styleB = new Style({
    stroke: new Stroke({ color: '#F44336', width: 3 }),
    fill: new Fill({ color: 'rgba(244,67,54,0.2)' }),
  });

  styleC = new Style({
    stroke: new Stroke({ color: '#FF9800', width: 3 }),
    fill: new Fill({ color: 'rgba(255,152,0,0.2)' }),
  });

  styleResult = new Style({
    stroke: new Stroke({ color: '#4CAF50', width: 4 }),
    fill: new Fill({ color: 'rgba(76,175,80,0.3)' }),
  });

  layerA = new VectorLayer({ source: new VectorSource(), style: this.styleA });
  layerB = new VectorLayer({ source: new VectorSource(), style: this.styleB });
  layerC = new VectorLayer({ source: new VectorSource(), style: this.styleC });
  layerResult = new VectorLayer({
    source: new VectorSource(),
    style: this.styleResult,
  });

  constructor(private alanAnalizService: AlanAnalizService) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
      this.map.updateSize();
    }, 100);
  }

  initMap(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({ source: new OSM() }),
        this.layerA,
        this.layerB,
        this.layerC,
        this.layerResult,
      ],
      view: new View({
        center: transform([32.85, 39.92], 'EPSG:4326', 'EPSG:3857'),
        zoom: 6,
      }),
    });

    this.enableDrawing();
  }

  enableDrawing(): void {
    this.draw = new Draw({ type: 'Polygon' });

    this.draw.on('drawend', (event) => {
      const feature = event.feature.clone();

      if (this.geometriAdi === 'A') {
        this.layerA.getSource()?.clear();
        this.layerA.getSource()?.addFeature(feature);
      }

      if (this.geometriAdi === 'B') {
        this.layerB.getSource()?.clear();
        this.layerB.getSource()?.addFeature(feature);
      }

      if (this.geometriAdi === 'C') {
        this.layerC.getSource()?.clear();
        this.layerC.getSource()?.addFeature(feature);
      }
    });

    this.map.addInteraction(this.draw);
  }

  kaydet(): void {
    let features: Feature[] = [];

    if (this.geometriAdi === 'A') features = this.layerA.getSource()?.getFeatures() || [];
    if (this.geometriAdi === 'B') features = this.layerB.getSource()?.getFeatures() || [];
    if (this.geometriAdi === 'C') features = this.layerC.getSource()?.getFeatures() || [];

    if (features.length === 0) return;

    const geojson = new GeoJSON().writeFeaturesObject(features, {
      featureProjection: 'EPSG:3857',
      dataProjection: 'EPSG:4326',
    });

    this.alanAnalizService
      .geometriKaydet({
        geometriAdi: this.geometriAdi,
        geometriJson: JSON.stringify(geojson),
      })
      .subscribe((res) => (this.sonuc = res));
  }

  kesisim(): void {
    this.alanAnalizService.kesisim({ a: 'A', b: 'B' }).subscribe((res: any) => {
      if (res.success && res.geoJson) this.cizSonuc(res.geoJson);
      this.sonuc = res;
    });
  }

  birlesimAB(): void {
    this.alanAnalizService.birlesimAB().subscribe((res: any) => {
      if (res.success && res.data) this.cizSonuc(res.data.geometriJson);
      this.sonuc = res;
    });
  }

  birlesimABC(): void {
    this.alanAnalizService.birlesimABC().subscribe((res: any) => {
      if (res.success && res.data) this.cizSonuc(res.data.geometriJson);
      this.sonuc = res;
    });
  }

  cizSonuc(geoJson: string): void {
    this.layerResult.getSource()?.clear();

    const feature = new GeoJSON().readFeature(JSON.parse(geoJson), {
      featureProjection: 'EPSG:3857',
      dataProjection: 'EPSG:4326',
    });

    this.layerResult.getSource()?.addFeature(feature);

    this.map.getView().fit(this.layerResult.getSource()!.getExtent(), {
      padding: [20, 20, 20, 20],
    });
  }
}
