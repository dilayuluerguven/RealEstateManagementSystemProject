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
    private readonly tasinmazService: TasinmazService,
    private readonly locService: LocationService,
    private readonly router: Router,
    private readonly toastr: ToastrService
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
  const {
    il,
    ilce,
    mahalle,
    ada,
    parsel,
    adres,
    emlakTipi,
    koordinat
  } = this.formGroup.value;

   if (!il || !ilce || !mahalle || !ada || !parsel || !adres || !emlakTipi) {
    this.toastr.warning('Lütfen tüm zorunlu alanları doldurunuz.');
    this.formGroup.markAllAsTouched();
    return;
  }
  if (!koordinat) {
    this.toastr.warning('Lütfen harita üzerinden taşınmaz çizin');
    return;
  }

  if (this.formGroup.invalid) {
    this.formGroup.markAllAsTouched();
    return;
  }

  const formData = new FormData();
  formData.append('ilId', String(il));
  formData.append('ilceId', String(ilce));
  formData.append('mahalleId', String(mahalle));
  formData.append('ada', String(ada));
  formData.append('parsel', String(parsel));
  formData.append('adres', adres);
  formData.append('emlakTipi', emlakTipi);
  formData.append('koordinat', koordinat);

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
