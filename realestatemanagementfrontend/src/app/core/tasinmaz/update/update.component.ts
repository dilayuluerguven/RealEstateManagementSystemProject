import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TasinmazService } from '../tasinmaz.service';
import { LocationService } from '../../shared/services/location.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent implements OnInit {

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

  constructor(
    private tasinmazService: TasinmazService,
    private locService: LocationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    this.locService.getIller().subscribe(res => {
      this.iller = res;
    });

    if (this.id) {
      this.loadTasinmaz();
    }

    this.formGroup.get('il')?.valueChanges.subscribe(ilId => {
      this.ilceler = [];
      this.mahalleler = [];

      this.formGroup.patchValue(
        { ilce: null, mahalle: null },
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
        koordinat: res.koordinat 
      });

      this.formGroup.get('koordinat')?.markAsTouched();
    });
  }

  onGeometryCreated(geometry: any) {
    this.formGroup.patchValue({
      koordinat: JSON.stringify(geometry)
    });

    this.formGroup.get('koordinat')?.markAsTouched();
    this.formGroup.get('koordinat')?.updateValueAndValidity();
  }

  update() {
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

    this.tasinmazService.update(this.id, dto).subscribe({
      next: () => {
        this.toastr.success('Taşınmaz başarıyla güncellendi');
        this.router.navigate(['/core/tasinmaz/list']);
      },
      error: () => {
        this.toastr.error('Güncelleme yapılamadı');
      }
    });
  }
}
