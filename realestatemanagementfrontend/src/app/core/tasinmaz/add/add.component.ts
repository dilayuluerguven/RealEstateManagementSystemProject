import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TasinmazService } from '../tasinmaz.service';
import { LocationService } from '../../shared/location.service';
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
  koordinat: new FormControl('', Validators.required),
});


  iller: any[] = [];
  ilceler: any[] = [];
  mahalleler: any[] = [];
  constructor(
    private tasinmazService: TasinmazService,
    private locService: LocationService,
    private router: Router,
    private toastr:ToastrService
  ) {}
 ngOnInit(): void {
  this.locService.getIller().subscribe(res => {
    this.iller = res;
  });

  this.formGroup.get('il')?.valueChanges.subscribe(ilId => {

    this.ilceler = [];
    this.mahalleler = [];

    this.formGroup.patchValue(
      {
        ilce: null,
        mahalle: null
      },
      { emitEvent: false }
    );

    if (!ilId) return;

    this.locService.getIlceler(ilId).subscribe(res => {
      this.ilceler = res;
    });
  });

  this.formGroup.get('ilce')?.valueChanges.subscribe(ilceId => {

    this.mahalleler = [];

    this.formGroup.patchValue(
      { mahalle: null },
      { emitEvent: false }
    );

    if (!ilceId) return;

    this.locService.getMahalleler(ilceId).subscribe(res => {
      this.mahalleler = res;
    });
  });
}

  submit() {
  if (this.formGroup.invalid) {
    this.formGroup.markAllAsTouched();
    return;
  }

  const dto = {
    ilId: this.formGroup.value.il!,
    ilceId: this.formGroup.value.ilce!,
    mahalleId: this.formGroup.value.mahalle!,
    ada: Number(this.formGroup.value.ada),
    parsel: Number(this.formGroup.value.parsel),
    adres: this.formGroup.value.adres!,
    emlakTipi: this.formGroup.value.emlakTipi!,
    koordinat: this.formGroup.value.koordinat!,
  };

  this.tasinmazService.add(dto).subscribe({
    next: () => {
      this.toastr.success('Taşınmaz başarıyla eklendi');
      this.router.navigate(['/core/tasinmaz/list']);
    },
    error: () => {
      this.toastr.error('Taşınmaz eklenemedi');
    }
  });
}

}
