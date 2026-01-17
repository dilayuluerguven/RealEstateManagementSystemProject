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
  sourceD = new VectorSource();
  sourceE = new VectorSource();
  sourceF = new VectorSource();

  layerA = new VectorLayer({ source: this.sourceA });
  layerB = new VectorLayer({ source: this.sourceB });
  layerC = new VectorLayer({ source: this.sourceC });
  layerD = new VectorLayer({ source: this.sourceD, zIndex: 5 });
  layerE = new VectorLayer({ source: this.sourceE, zIndex: 6 });
  layerF = new VectorLayer({ source: this.sourceF, zIndex: 10 });

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
        this.layerA, this.layerB, this.layerC, 
        this.layerD, this.layerE, this.layerF
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
      this.sonuc = null;
    });
    this.map.addInteraction(this.draw);
  }

  geometriDegisti(): void {
    this.ilkHaliGoster();
    this.startDraw();
    this.toastr.info(`${this.seciliGeometri} katmanı aktif.`, 'Bilgi');
  }

  getLayer(adi: string): VectorLayer<VectorSource> {
    if (adi === 'A') return this.layerA;
    if (adi === 'B') return this.layerB;
    if (adi === 'C') return this.layerC;
    if (adi === 'D') return this.layerD;
    if (adi === 'E') return this.layerE;
    return this.layerF;
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
      this.toastr.info('A ve B dolu olmalıdır.');
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
      this.toastr.info('A, B ve C dolu olmalıdır.');
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
      this.toastr.info('Kesişim için A ve B gereklidir.');
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
    this.sourceF.clear();
    this.sourceF.addFeature(this.geoJson.readFeature(geo));
    this.hizliGosterimAyari('F');
    this.sonuc = { mesaj: 'Kesişim gösteriliyor', alan: turf.area(geo) };
  }

  showAndSave(geo: any, ad: 'D' | 'E', islem: string): void {
    const source = this.getLayer(ad).getSource()!;
    source.clear();
    source.addFeature(this.geoJson.readFeature(geo));
    this.hizliGosterimAyari(ad);
    const dto: AlanAnalizCreate = {
      geometriAdi: ad,
      analizTuru: 'BIRLESIM',
      islem: islem,
      geometriJson: JSON.stringify(geo),
      alanMetrekare: turf.area(geo),
    };
    this.alanAnalizService.kaydet(dto).subscribe((r) => {
      this.sonuc = r;
      this.toastr.success(`${ad} kaydedildi.`);
      this.loadFromDb();
    });
  }

  hizliGosterimAyari(aktif: string): void {
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(h => {
      this.getLayer(h).setVisible(h === aktif);
    });
  }

  loadFromDb(): void {
    ['A', 'B', 'C', 'D', 'E'].forEach((g) => {
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
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(h => {
      this.getLayer(h).setVisible(h === harf);
    });
    this.toastr.info(`Sadece ${harf} gösteriliyor.`);
  }

  ilkHaliGoster(): void {
    this.layerA.setVisible(true);
    this.layerB.setVisible(true);
    this.layerC.setVisible(true);
    this.layerD.setVisible(false);
    this.layerE.setVisible(false);
    this.layerF.setVisible(false);
    this.sonuc = null;
  }

  hepsiniTemizle(): void {
    const toast = this.toastr.warning('Silmek için tıkla.', 'Onay', { timeOut: 5000 });
    toast.onTap.subscribe(() => {
      ['A', 'B', 'C', 'D', 'E'].forEach(g => this.alanAnalizService.temizle(g).subscribe());
      [this.sourceA, this.sourceB, this.sourceC, this.sourceD, this.sourceE, this.sourceF].forEach(s => s.clear());
      this.ilkHaliGoster();
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