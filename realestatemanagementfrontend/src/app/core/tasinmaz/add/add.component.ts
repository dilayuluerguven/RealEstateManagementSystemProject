import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TasinmazService } from '../tasinmaz.service';
import { LocationService } from '../../shared/location.service';
import { Router } from '@angular/router';
import { Tasinmaz } from '../models/tasinmaz';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponent implements OnInit {
  formGroup = new FormGroup({
    il: new FormControl<number | null>(null),
    ilce: new FormControl<number | null>(null),
    mahalle: new FormControl<number | null>(null),
    ada: new FormControl(''),
    parsel: new FormControl(''),
    adres: new FormControl(''),
    emlakTipi: new FormControl(''),
    koordinat: new FormControl(''),
  });

  iller: any[] = [];
  ilceler: any[] = [];
  mahalleler: any[] = [];
  constructor(
    private tasinmazService: TasinmazService,
    private locService: LocationService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.locService.getIller().subscribe((res) => {
      console.log('iller', res);

      this.iller = res;
    });
    this.formGroup.get('il')?.valueChanges.subscribe((ilId) => {
      if (!ilId) {
        this.ilceler = [];
        this.formGroup.get('ilce')?.reset();
        return;
      }
      this.locService.getIlceler(Number(ilId)).subscribe((res) => {
        this.ilceler = res;
      });
    });
    this.formGroup.get('ilce')?.valueChanges.subscribe((ilceId) => {
      if (!ilceId) {
        this.mahalleler = [];
        this.formGroup.get('mahalle')?.reset();
        return;
      }
      this.locService.getMahalleler(Number(ilceId)).subscribe((res) => {
        this.mahalleler = res;
      });
    });
  }
  submit() {
    const dto: Tasinmaz = {
      userId:1,
      ilId: Number(this.formGroup.value.il),
      ilceId: Number(this.formGroup.value.ilce),
      mahalleId: Number(this.formGroup.value.mahalle),
      ada: Number(this.formGroup.value.ada)!,
      parsel:Number( this.formGroup.value.parsel)!,
      adres: this.formGroup.value.adres!,
      emlakTipi: this.formGroup.value.emlakTipi!,
      koordinat: this.formGroup.value.koordinat!,
    };

    this.tasinmazService.add(dto).subscribe({
      next: () => {
        alert('Taşınmaz eklendi.');
        this.formGroup.reset();
        this.router.navigate(['/core/tasinmaz/list']);
      },
    });
  }
}
