import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TasinmazService } from '../tasinmaz.service';
import { LocationService } from '../../shared/services/location.service';
import { environment } from 'src/environments/environment';
import { TasinmazMapComponent } from '../../../shared/tasinmaz-map/tasinmaz-map.component';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent implements OnInit {
  @ViewChild(TasinmazMapComponent)
  mapComponent!: TasinmazMapComponent;

  formGroup = new FormGroup({
    il: new FormControl<number | null>(null, Validators.required),
    ilce: new FormControl<number | null>(null, Validators.required),
    mahalle: new FormControl<number | null>(null, Validators.required),
    ada: new FormControl<number | null>(null, Validators.required),
    parsel: new FormControl<number | null>(null, Validators.required),
    adres: new FormControl<string | null>(null, Validators.required),
    emlakTipi: new FormControl<string | null>(null, Validators.required),
    koordinat: new FormControl<string | null>(null, Validators.required),
  });

  id!: number;
  iller: any[] = [];
  ilceler: any[] = [];
  mahalleler: any[] = [];
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  currentImageUrl: string | null = null;

  constructor(
    private tasinmazService: TasinmazService,
    private locService: LocationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.locService.getIller().subscribe(res => this.iller = res);

    if (this.id) this.loadTasinmaz();

    this.formGroup.get('il')?.valueChanges.subscribe(ilId => {
      this.ilceler = [];
      this.mahalleler = [];
      this.formGroup.patchValue({ ilce: null, mahalle: null }, { emitEvent: false });
      if (ilId) this.locService.getIlceler(ilId).subscribe(res => this.ilceler = res);
    });

    this.formGroup.get('ilce')?.valueChanges.subscribe(ilceId => {
      this.mahalleler = [];
      this.formGroup.patchValue({ mahalle: null }, { emitEvent: false });
      if (ilceId) this.locService.getMahalleler(ilceId).subscribe(res => this.mahalleler = res);
    });
  }

  private loadTasinmaz(): void {
    this.tasinmazService.getById(this.id).subscribe(res => {
      this.formGroup.patchValue({
        il: res.ilId,
        ilce: res.ilceId,
        mahalle: res.mahalleId,
        ada: res.ada,
        parsel: res.parsel,
        adres: res.adres,
        emlakTipi: res.emlakTipi,
        koordinat: res.koordinat,
      });

      this.currentImageUrl = `${environment.baseUrl}/api/Tasinmaz/${this.id}/image`;

      this.locService.getIlceler(res.ilId).subscribe(x => this.ilceler = x);
      this.locService.getMahalleler(res.ilceId).subscribe(x => this.mahalleler = x);
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = e => (this.previewUrl = e.target?.result || null);
    reader.readAsDataURL(file);
  }

  onGeometryCreated(geometry: any) {
    this.formGroup.patchValue({ koordinat: JSON.stringify(geometry) });
  }

  focusToGeometry() {
    if (!this.mapComponent) return;
    this.mapComponent.focusToGeometry();
  }

  update() {
    if (this.formGroup.invalid) return;

    const formData = new FormData();
    formData.append('Id', String(this.id));
    formData.append('IlId', String(this.formGroup.value.il));
    formData.append('IlceId', String(this.formGroup.value.ilce));
    formData.append('MahalleId', String(this.formGroup.value.mahalle));
    formData.append('Ada', String(this.formGroup.value.ada));
    formData.append('Parsel', String(this.formGroup.value.parsel));
    formData.append('Adres', this.formGroup.value.adres!);
    formData.append('EmlakTipi', this.formGroup.value.emlakTipi!);
    formData.append('Koordinat', this.formGroup.value.koordinat!);

    if (this.selectedFile) formData.append('Image', this.selectedFile);

    this.tasinmazService.update(this.id, formData).subscribe({
      next: () => {
        this.toastr.success('Başarıyla güncellendi');
        this.router.navigate(['/core/tasinmaz/list']);
      },
      error: () => {
        this.toastr.error('Güncelleme hatası');
      }
    });
  }
}
