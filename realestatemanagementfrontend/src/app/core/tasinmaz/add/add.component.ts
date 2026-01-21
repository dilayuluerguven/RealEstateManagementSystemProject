import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TasinmazService } from '../tasinmaz.service';
import { LocationService } from '../../shared/services/location.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponent implements OnInit {

  formGroup = new FormGroup({
    il: new FormControl<number | null>(null, Validators.required),
    ilce: new FormControl<number | null>(null, Validators.required),
    mahalle: new FormControl<number | null>(null, Validators.required),
    ada: new FormControl<number | null>(null, Validators.required),
    parsel: new FormControl<number | null>(null, Validators.required),
    adres: new FormControl('', Validators.required),
    emlakTipi: new FormControl('', Validators.required),
    koordinat: new FormControl<string | null>(null, Validators.required)
  });

  iller: any[] = [];
  ilceler: any[] = [];
  mahalleler: any[] = [];

  selectedFile: File | null = null;

  constructor(
    private tasinmazService: TasinmazService,
    private locService: LocationService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.locService.getIller().subscribe(res => this.iller = res);

    this.formGroup.get('il')?.valueChanges.subscribe(ilId => {
      this.ilceler = [];
      this.mahalleler = [];
      this.formGroup.patchValue({ ilce: null, mahalle: null }, { emitEvent: false });

      if (!ilId) return;
      this.locService.getIlceler(ilId).subscribe(res => this.ilceler = res);
    });

    this.formGroup.get('ilce')?.valueChanges.subscribe(ilceId => {
      this.mahalleler = [];
      this.formGroup.patchValue({ mahalle: null }, { emitEvent: false });

      if (!ilceId) return;
      this.locService.getMahalleler(ilceId).subscribe(res => this.mahalleler = res);
    });
  }

  onFileSelected(file: File | null) {
    this.selectedFile = file;
  }

  submit() {
    if (!this.formGroup.value.koordinat) {
      this.toastr.warning('Lütfen harita üzerinden taşınmaz çizin');
      return;
    }

    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('ilId', String(this.formGroup.value.il));
    formData.append('ilceId', String(this.formGroup.value.ilce));
    formData.append('mahalleId', String(this.formGroup.value.mahalle));
    formData.append('ada', String(this.formGroup.value.ada));
    formData.append('parsel', String(this.formGroup.value.parsel));
    formData.append('adres', this.formGroup.value.adres!);
    formData.append('emlakTipi', this.formGroup.value.emlakTipi!);
    formData.append('koordinat', this.formGroup.value.koordinat!);

    if (this.selectedFile) {
      formData.append('Image', this.selectedFile);
    }

    this.tasinmazService.add(formData).subscribe({
      next: () => {
        this.toastr.success('Taşınmaz başarıyla eklendi');
        this.router.navigate(['/core/tasinmaz/list']);
      },
      error: () => {
        this.toastr.error('Taşınmaz eklenemedi');
      }
    });
  }

  onGeometryCreated(geometry: any) {
    this.formGroup.patchValue({
      koordinat: JSON.stringify(geometry),
    });
    this.formGroup.get('koordinat')?.markAsTouched();
  }
}
