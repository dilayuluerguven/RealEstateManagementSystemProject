import { Component, OnInit } from '@angular/core';
import { TasinmazService } from '../tasinmaz.service';
import { TasinmazList } from '../models/tasinmaz-list';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ExportService } from 'src/app/shared/services/export.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  tasinmazlar: TasinmazList[] = [];
  selectedTasinmazlar: TasinmazList[] = [];
  isAdmin = false;

  constructor(
    private tasinmazService: TasinmazService,
    private toastr: ToastrService,
    private router: Router,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.isAdmin = user?.rol === 'Admin';
    this.getAll();
  }

  getAll() {
    this.tasinmazService.getAll().subscribe({
      next: (x) => (this.tasinmazlar = x),
      error: () => this.toastr.error('Taşınmazlar yüklenemedi'),
    });
  }

  isSelected(data: TasinmazList): boolean {
    return this.selectedTasinmazlar.some((x) => x.id === data.id);
  }

  toggleItem(data: TasinmazList) {
    if (this.isSelected(data)) {
      this.selectedTasinmazlar = this.selectedTasinmazlar.filter(
        (x) => x.id !== data.id
      );
    } else {
      this.selectedTasinmazlar.push(data);
    }
  }

  deleteSelected() {
    const count = this.selectedTasinmazlar.length;
    const toast = this.toastr.warning(
      count === 1
        ? 'Seçili taşınmaz silinecek.<br><strong>Onaylamak için buraya tıklayın.</strong>'
        : `${count} taşınmaz silinecek.<br><strong>Onaylamak için buraya tıklayın.</strong>`,
      'Onay Gerekli',
      { enableHtml: true, closeButton: true, timeOut: 0, tapToDismiss: false }
    );

    toast.onTap.subscribe(() => {
      this.selectedTasinmazlar.forEach((item) =>
        this.tasinmazService.delete(item.id).subscribe()
      );

      this.tasinmazlar = this.tasinmazlar.filter(
        (t) => !this.selectedTasinmazlar.some((s) => s.id === t.id)
      );

      this.selectedTasinmazlar = [];
      this.toastr.success('Silme işlemi tamamlandı');
    });
  }

  goToUpdate() {
    if (this.selectedTasinmazlar.length !== 1) return;
    const id = this.selectedTasinmazlar[0].id;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const url = user?.rol === 'Admin'
      ? ['/core/admin/tasinmaz/update', id]
      : ['/core/tasinmaz/update', id];

    this.router.navigate(url);
  }

  get deleteButtonText(): string {
    return this.selectedTasinmazlar.length
      ? `Sil (${this.selectedTasinmazlar.length})`
      : 'Sil';
  }

  isAllSelected(): boolean {
    return (
      this.tasinmazlar.length > 0 &&
      this.selectedTasinmazlar.length === this.tasinmazlar.length
    );
  }

  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedTasinmazlar = checked ? [...this.tasinmazlar] : [];
  }

  exportExcel() {
    const data =
      this.selectedTasinmazlar.length > 0
        ? this.selectedTasinmazlar
        : this.tasinmazlar;

    const fileName =
      this.selectedTasinmazlar.length > 0
        ? 'secili_tasinmazlar.xlsx'
        : 'tasinmazlar.xlsx';

    this.exportService.exportExcel(data, fileName, 'Tasinmazlar');

    this.toastr.success(
      this.selectedTasinmazlar.length > 0
        ? 'Seçili taşınmazlar Excel’e aktarıldı'
        : 'Tüm taşınmazlar Excel’e aktarıldı'
    );
  }

  exportPdf() {
    const data =
      this.selectedTasinmazlar.length > 0
        ? this.selectedTasinmazlar
        : this.tasinmazlar;

    const fileName =
      data === this.tasinmazlar ? 'tasinmazlar.pdf' : 'secili_tasinmazlar.pdf';

    const headers = [
      'Id',
      'Kullanıcı',
      'İl',
      'İlçe',
      'Mahalle',
      'Ada',
      'Parsel',
      'Adres',
      'Tip',
      'Tarih',
    ];

    const rows = data.map((t) => [
      t.id,
      t.adSoyad,
      t.ilAdi,
      t.ilceAdi,
      t.mahalleAdi,
      t.ada,
      t.parsel,
      t.adres,
      t.emlakTipi,
      t.olusturmaTarihi
        ? new Date(t.olusturmaTarihi).toLocaleDateString()
        : '',
    ]);

    this.exportService.exportPdf('Taşınmaz Listesi', headers, rows, fileName);

    this.toastr.success(
      data === this.tasinmazlar
        ? 'Tüm taşınmazlar PDF’e aktarıldı'
        : 'Seçili taşınmazlar PDF’e aktarıldı'
    );
  }
}
