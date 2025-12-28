import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TasinmazService } from '../tasinmaz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from '../../shared/location.service';

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

  id: number | undefined;
  iller: any[] = [];
  ilceler: any[] = [];
  mahalleler: any[] = [];
  userId!:number;

  constructor(
    private tasinmazService: TasinmazService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private locService: LocationService
  ) {}
  ngOnInit(): void {
    this.locService.getIller().subscribe((x) => {
      this.iller = x;
    });
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (this.id) {
      this.tasinmazService.getById(this.id).subscribe((x) => {
        console.log('Taşinmaz:', x);
        this.userId=x.userId;
        this.formGroup.patchValue({
          il: x.ilId,
          ilce: x.ilceId,
          mahalle: x.mahalleId,
          ada: x.ada,
          parsel: x.parsel,
          adres: x.adres,
          emlakTipi: x.emlakTipi,
          koordinat: x.koordinat,
        });
      });
    }
    this.formGroup.get('il')?.valueChanges.subscribe((ilId) => {
      if (!ilId) {
        this.ilceler = [];
        this.formGroup.get('ilce')?.reset();
        return;
      }

      this.locService.getIlceler(ilId).subscribe((res) => {
        this.ilceler = res;
      });
    });

    this.formGroup.get('ilce')?.valueChanges.subscribe((ilceId) => {
      if (!ilceId) {
        this.mahalleler = [];
        this.formGroup.get('mahalle')?.reset();
        return;
      }

      this.locService.getMahalleler(ilceId).subscribe((res) => {
        this.mahalleler = res;
      });
    });
  }
  update() {
    if (!this.id) return;
    const dto = {
      id:this.id, 
      userId:this.userId,
      ilId: this.formGroup.value.il!,
      ilceId: this.formGroup.value.ilce!,
      mahalleId: this.formGroup.value.mahalle!,
      ada: this.formGroup.value.ada!,
      parsel: this.formGroup.value.parsel!,
      adres: this.formGroup.value.adres!,
      emlakTipi: this.formGroup.value.emlakTipi!,
      koordinat: this.formGroup.value.koordinat!,
    };
    this.tasinmazService.update(this.id, dto).subscribe({
      next: () => {
        alert('Taşınmaz güncellendi');
        this.router.navigate(['/core/tasinmaz/list']);
      },
      error: () => {
        alert('Güncelleme yapılamadı.');
      },
    });
  }
}
