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
import { MapHelperService } from 'src/app/shared/services/map-helper.service';

@Component({
  selector: 'app-alan-analizi',
  templateUrl: './alan-analizi.component.html',
  styleUrls: ['./alan-analizi.component.css'],
})
export class AlanAnalizComponent implements AfterViewInit {
  sonuc: any = null;
  map!: Map;
  draw!: Draw;
  opacity: number = 1;
  baseLayer!: TileLayer<OSM>;
  seciliGeometri: string | null = null;

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
    private toastr: ToastrService, private mapHelper: MapHelperService
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.ilkHaliGoster();
    this.toastr.info("Manuel veya Auto-Select modunu seçin.", "Bilgi");
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
      this.layerA,
      this.layerB,
      this.layerC,
      this.layerD,
      this.layerE,
      this.layerF,
    ],
    view: new View({
      center: [3660000, 4860000],
      zoom: 6,
    }),
  });

  this.mapHelper.addScale(this.map);
}
opacityDegisti(): void {
  this.mapHelper.setAllLayersOpacity(this.map, this.opacity);
}


  getLayer(adi: string) {
    if (adi === 'A') return this.layerA;
    if (adi === 'B') return this.layerB;
    if (adi === 'C') return this.layerC;
    if (adi === 'D') return this.layerD;
    if (adi === 'E') return this.layerE;
    return this.layerF;
  }
  startDraw(): void {
  if (!this.seciliGeometri) {
    this.toastr.warning("Lütfen önce bir çalışma katmanı seçiniz.", "Uyarı");
    return;
  }

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
  if (!this.seciliGeometri) {
    this.toastr.warning("Lütfen bir çalışma katmanı seçiniz.", "Uyarı");
    return;
  }

  this.ilkHaliGoster();
  this.startDraw();
  this.toastr.info(`${this.seciliGeometri} katmanı aktif.`, 'Bilgi');
}

 kaydetABC(): void {
  if (!this.seciliGeometri) {
    this.toastr.warning('Lütfen bir çalışma katmanı seçiniz.', 'Uyarı');
    return;
  }

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
    next: () =>
      this.toastr.success(`${this.seciliGeometri} kaydedildi.`, 'Başarılı'),
    error: () => this.toastr.error('Hata oluştu.', 'Hata'),
  });
}

  birlesimAB(): void {
    this.ilkHaliGoster();
    this.sourceF.clear();
    this.sonuc = null;
    const a = this.sourceA.getFeatures();
    const b = this.sourceB.getFeatures();
    if (!a.length || !b.length) {
      this.toastr.warning("A ve B geometrileri eksik.", "Uyarı");
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
    this.ilkHaliGoster();
    this.sourceF.clear();
    this.sonuc = null;
    const a = this.sourceA.getFeatures();
    const b = this.sourceB.getFeatures();
    const c = this.sourceC.getFeatures();
    if (!a.length || !b.length || !c.length) {
      this.toastr.warning("A, B ve C eksik.", "Uyarı");
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
    this.ilkHaliGoster();
    this.sourceF.clear();
    this.sonuc = null;

    const a = this.sourceA.getFeatures();
    const b = this.sourceB.getFeatures();

    if (!a.length || !b.length) {
      this.toastr.warning("A ve B geometrileri eksik.", "Uyarı");
      return;
    }

    const fa = this.geoJson.writeFeatureObject(a[0]);
    const fb = this.geoJson.writeFeatureObject(b[0]);
    const result = turf.intersect(turf.featureCollection([fa as any, fb as any]));

    if (result) this.sadeceGorselGoster(result, "A ∩ B");
    else this.toastr.warning("Kesişim yok.", "Bilgi");
  }
  kesisimBA(): void {
    this.ilkHaliGoster();
    this.sourceF.clear();
    this.sonuc = null;

    const a = this.sourceA.getFeatures();
    const b = this.sourceB.getFeatures();

    if (!a.length || !b.length) {
      this.toastr.warning("A ve B geometrileri eksik.", "Uyarı");
      return;
    }

    const fa = this.geoJson.writeFeatureObject(a[0]);
    const fb = this.geoJson.writeFeatureObject(b[0]);
    const result = turf.intersect(turf.featureCollection([fb as any, fa as any]));

    if (result) this.sadeceGorselGoster(result, "B ∩ A");
    else this.toastr.warning("Kesişim yok.", "Bilgi");
  }
  sadeceGorselGoster(geo: any, islemAdi: string): void {
    this.sourceF.clear();
    this.sourceF.addFeature(this.geoJson.readFeature(geo));
    this.hizliGosterimAyari('F');
    this.sonuc = { mesaj: `${islemAdi} gösteriliyor`, alan: turf.area(geo) };
  }
  showAndSave(geo: any, ad: 'D' | 'E', islem: string): void {
    this.sourceF.clear();
    this.sonuc = null;

    const source = this.getLayer(ad).getSource()!;
    source.clear();
    source.addFeature(this.geoJson.readFeature(geo));

    const dto: AlanAnalizCreate = {
      geometriAdi: ad,
      analizTuru: 'BIRLESIM',
      islem: islem,
      geometriJson: JSON.stringify(geo),
      alanMetrekare: turf.area(geo),
    };

    this.alanAnalizService.kaydet(dto).subscribe(() => {
      this.toastr.success("Birleşim kaydedildi.", "Başarılı");
    });

    this.hizliGosterimAyari(ad);
  }
  hizliGosterimAyari(aktif: string): void {
    ['A','B','C','D','E','F'].forEach(h => {
      this.getLayer(h).setVisible(h === aktif);
    });
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
  sadeceGoster(harf: string): void {
    const s = this.getLayer(harf).getSource();
    if (!s || s.getFeatures().length === 0) {
      this.toastr.warning(`${harf} katmanı boş.`);
      return;
    }
    this.hizliGosterimAyari(harf);
  }
  ekraniTemizle(): void {
    this.sourceA.clear();
    this.sourceB.clear();
    this.sourceC.clear();
    this.sourceF.clear();
    this.sonuc = null;
    this.ilkHaliGoster();
    this.toastr.info("Ekran temizlendi.", "Bilgi");
  }
  kaliciSil(): void {
    const toast = this.toastr.warning(
      "A–B–C kayıtlarını kalıcı olarak silmek için tıklayın.",
      "Kalıcı Sil",
      { timeOut: 5000 }
    );

    toast.onTap.subscribe(() => {
      ["A", "B", "C"].forEach(g => this.alanAnalizService.temizle(g).subscribe());
      this.ekraniTemizle();
      this.toastr.success("Kayıtlar silindi.", "Başarılı");
    });
  }
  getGeometriVerisi(harf: string) {
    const source = this.getLayer(harf).getSource();
    const f = source?.getFeatures()[0];
    if (!f) return null;
    const geo = this.geoJson.writeFeatureObject(f);
    return { alanMetrekare: turf.area(geo as any) };
  }
  autoSelect(): void {
    if (this.draw) this.map.removeInteraction(this.draw);

    const geometriler = ['A','B','C'];
    let eksik = false;

    geometriler.forEach(g => this.getLayer(g).getSource()!.clear());
    geometriler.forEach(g => {
      this.alanAnalizService.getir(g)
        .pipe(catchError(() => of(null)))
        .subscribe(res => {
          if (res?.data?.geometriJson) {
            this.getLayer(g).getSource()!.addFeature(
              this.geoJson.readFeature(JSON.parse(res.data.geometriJson))
            );
          } else eksik = true;

          if (g === 'C') {
            this.ilkHaliGoster();
            if (eksik) this.toastr.warning("Kayıtlı geometri bulunamadı.", "Auto-Select");
            else this.toastr.success("A–B–C otomatik yüklendi.", "Auto-Select");
          }
        });
    });
  }
  manuelMod(): void {
    this.ilkHaliGoster();
    this.startDraw();
    this.toastr.info("Manuel çizim modu aktif.", "Bilgi");
  }
}
