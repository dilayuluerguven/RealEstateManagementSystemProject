import { Component, AfterViewInit } from '@angular/core';
import { AlanAnalizService } from '../../services/alan-analizi.service';
import { AlanAnalizCreate } from '../../models/alan-analiz-create';
import { ToastrService } from 'ngx-toastr';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import Draw from 'ol/interaction/Draw';
import GeoJSON from 'ol/format/GeoJSON';
import * as turf from '@turf/turf';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-alan-analizi',
  templateUrl: './alan-analizi.component.html',
  styleUrls: ['./alan-analizi.component.css'],
})
export class AlanAnalizComponent implements AfterViewInit {
  seciliGeometri: 'A' | 'B' | 'C' = 'A';
  sonuc: any = null;
  map!: Map;
  draw!: Draw;

  sourceA = new VectorSource();
  sourceB = new VectorSource();
  sourceC = new VectorSource();
  sourceResult = new VectorSource();

  layerA = new VectorLayer({ source: this.sourceA });
  layerB = new VectorLayer({ source: this.sourceB });
  layerC = new VectorLayer({ source: this.sourceC });
  layerResult = new VectorLayer({ source: this.sourceResult, zIndex: 10 });

  geoJson = new GeoJSON({
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857',
  });

  constructor(
    private alanAnalizService: AlanAnalizService,
    private toastr: ToastrService
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.startDraw();
    this.loadFromDb();
  }

  initMap(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({ source: new OSM() }),
        this.layerA, this.layerB, this.layerC, this.layerResult
      ],
      view: new View({
        center: [3660000, 4860000],
        zoom: 6,
      }),
    });
  }

  startDraw(): void {
    if (this.draw) this.map.removeInteraction(this.draw);
    const activeSource = this.getLayer(this.seciliGeometri).getSource()!;
    this.draw = new Draw({ source: activeSource, type: 'Polygon' });
    this.draw.on('drawstart', () => {
      activeSource.clear();
      this.sourceResult.clear();
      this.sonuc = null;
    });
    this.map.addInteraction(this.draw);
  }

  geometriDegisti(): void {
    this.layerA.setVisible(true);
    this.layerB.setVisible(true);
    this.layerC.setVisible(true);
    this.layerResult.setVisible(true);
    this.startDraw();
    this.toastr.info(`${this.seciliGeometri} katmanı aktif.`, 'Bilgi');
  }

  getLayer(adi: string): VectorLayer<VectorSource> {
    if (adi === 'A') return this.layerA;
    if (adi === 'B') return this.layerB;
    if (adi === 'C') return this.layerC;
    return this.layerResult;
  }

  kaydetABC(): void {
    const features = this.getLayer(this.seciliGeometri).getSource()?.getFeatures();
    if (!features?.length) {
      this.toastr.warning('Lütfen önce çizim yapın.', 'Uyarı');
      return;
    }
    const geo = this.geoJson.writeFeatureObject(features[0]) as any;
    const dto: AlanAnalizCreate = {
      geometriAdi: this.seciliGeometri,
      analizTuru: 'ORIJINAL',
      islem: 'Kaydet',
      geometriJson: JSON.stringify(geo),
      alanMetrekare: turf.area(geo),
    };
    this.alanAnalizService.kaydet(dto).subscribe({
      next: (r) => {
        this.sonuc = r;
        this.toastr.success(`${this.seciliGeometri} kaydedildi.`, 'Başarılı');
        this.loadFromDb();
      },
      error: () => this.toastr.error('Hata oluştu.', 'Hata')
    });
  }

  birlesimAB(): void {
    const a = this.sourceA.getFeatures();
    const b = this.sourceB.getFeatures();
    if (!a.length || !b.length) {
      this.toastr.info('A ve B katmanları dolu olmalıdır.');
      return;
    }
    const fa = this.geoJson.writeFeatureObject(a[0]);
    const fb = this.geoJson.writeFeatureObject(b[0]);
    const unionResult = turf.union(turf.featureCollection([fa as any, fb as any]));
    if (unionResult) {
      const buffered = turf.buffer(unionResult, 0);
      if (buffered) this.showAndSave(buffered, 'D', 'A ∪ B');
    }
  }

  birlesimABC(): void {
    const a = this.sourceA.getFeatures();
    const b = this.sourceB.getFeatures();
    const c = this.sourceC.getFeatures();
    if (!a.length || !b.length || !c.length) {
      this.toastr.info('A, B ve C katmanları dolu olmalıdır.');
      return;
    }
    const fa = this.geoJson.writeFeatureObject(a[0]);
    const fb = this.geoJson.writeFeatureObject(b[0]);
    const fc = this.geoJson.writeFeatureObject(c[0]);
    const unionResult = turf.union(turf.featureCollection([fa as any, fb as any, fc as any]));
    if (unionResult) {
      const buffered = turf.buffer(unionResult, 0);
      if (buffered) this.showAndSave(buffered, 'E', 'A ∪ B ∪ C');
    }
  }

  kesisim(): void {
    const a = this.sourceA.getFeatures();
    const b = this.sourceB.getFeatures();
    if (!a.length || !b.length) {
      this.toastr.info('Kesişim için A ve B çizilmiş olmalıdır.');
      return;
    }
    const fa = this.geoJson.writeFeatureObject(a[0]);
    const fb = this.geoJson.writeFeatureObject(b[0]);
    const intersect = turf.intersect(turf.featureCollection([fa as any, fb as any]));
    if (intersect) {
      this.sadeceGorselGoster(intersect);
    } else {
      this.toastr.warning('Kesişim bulunamadı.');
    }
  }

  sadeceGorselGoster(geo: any): void {
    this.sourceResult.clear();
    const feature = this.geoJson.readFeature(geo);
    this.sourceResult.addFeature(feature);
    this.layerA.setVisible(false);
    this.layerB.setVisible(false);
    this.layerC.setVisible(false);
    this.layerResult.setVisible(true);
    this.sonuc = { mesaj: 'Kesişim görsel olarak gösteriliyor', alan: turf.area(geo) };
    this.toastr.info('Kesişim haritada (F).');
  }

  showAndSave(geo: any, ad: 'D' | 'E', islem: string): void {
    this.sourceResult.clear();
    this.sourceResult.addFeature(this.geoJson.readFeature(geo));
    this.layerA.setVisible(false);
    this.layerB.setVisible(false);
    this.layerC.setVisible(false);
    this.layerResult.setVisible(true);
    const dto: AlanAnalizCreate = {
      geometriAdi: ad,
      analizTuru: 'BIRLESIM',
      islem: islem,
      geometriJson: JSON.stringify(geo),
      alanMetrekare: turf.area(geo),
    };
    this.alanAnalizService.kaydet(dto).subscribe((r) => {
      this.sonuc = r;
      this.toastr.success(`${ad} analizi kaydedildi.`);
      this.loadFromDb();
    });
  }

  loadFromDb(): void {
    const tipler: ('A' | 'B' | 'C' | 'D' | 'E')[] = ['A', 'B', 'C', 'D', 'E'];
    tipler.forEach((g) => {
      this.alanAnalizService.getir(g).pipe(catchError(() => of(null))).subscribe((res) => {
        if (res?.data?.geometriJson) {
          const source = this.getLayer(g).getSource()!;
          source.clear();
          source.addFeature(this.geoJson.readFeature(JSON.parse(res.data.geometriJson)));
        }
      });
    });
  }

  sadeceGoster(harf: string): void {
    this.layerA.setVisible(harf === 'A');
    this.layerB.setVisible(harf === 'B');
    this.layerC.setVisible(harf === 'C');
    this.layerResult.setVisible(harf === 'D' || harf === 'E' || harf === 'F');
    this.toastr.info(`Sadece ${harf} gösteriliyor.`);
  }

  ilkHaliGoster(): void {
    this.layerA.setVisible(true);
    this.layerB.setVisible(true);
    this.layerC.setVisible(true);
    this.layerResult.setVisible(false);
    this.sonuc = null;
    this.toastr.success('A, B ve C gösteriliyor.');
  }

  hepsiniTemizle(): void {
    const toast = this.toastr.warning('Silmek için tıkla.', 'Onay', { timeOut: 5000 });
    toast.onTap.subscribe(() => {
      ['A', 'B', 'C', 'D', 'E'].forEach(g => this.alanAnalizService.temizle(g).subscribe());
      this.sourceA.clear(); this.sourceB.clear(); this.sourceC.clear(); this.sourceResult.clear();
      this.layerA.setVisible(true); this.layerB.setVisible(true); this.layerC.setVisible(true);
      this.sonuc = null;
      this.toastr.success('Temizlendi.');
    });
  }

  getGeometriVerisi(harf: string) {
    const source = this.getLayer(harf).getSource();
    const feature = source?.getFeatures()[0];
    if (!feature) return null;
    const geojson = this.geoJson.writeFeatureObject(feature);
    let sembol = harf + ' (Orijinal)';
    if (harf === 'D') sembol = 'A ∪ B';
    else if (harf === 'E') sembol = 'A ∪ B ∪ C';
    return { islemSembol: sembol, alanMetrekare: turf.area(geojson as any) };
  }
}