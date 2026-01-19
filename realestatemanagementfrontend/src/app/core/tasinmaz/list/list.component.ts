import { Component, OnInit } from '@angular/core';
import { TasinmazService } from '../tasinmaz.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ExportService } from 'src/app/shared/services/export.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  apiUrl = environment.baseUrl;
  tasinmazlar: any[] = [];
  filteredTasinmazlar: any[] = [];
  selectedTasinmazlar: any[] = [];
  isAdmin = false;
  filterText = '';

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
      next: (x) => {
        const ts = Date.now();
        this.tasinmazlar = x.map(item => ({
          ...item,
          cacheBuster: ts
        }));
        this.filteredTasinmazlar = this.tasinmazlar;
      },
      error: () => this.toastr.error('Taşınmazlar yüklenemedi'),
    });
  }

  applyFilter() {
    const t = this.filterText.toLowerCase();
    this.filteredTasinmazlar = this.tasinmazlar.filter((x) =>
      x.adSoyad?.toLowerCase().includes(t) ||
      x.ilAdi?.toLowerCase().includes(t) ||
      x.ilceAdi?.toLowerCase().includes(t) ||
      x.mahalleAdi?.toLowerCase().includes(t) ||
      x.ada?.toString().includes(t) ||
      x.parsel?.toString().includes(t) ||
      x.adres?.toLowerCase().includes(t) ||
      x.emlakTipi?.toLowerCase().includes(t)
    );
  }

  isSelected(item: any): boolean {
    return this.selectedTasinmazlar.some(x => x.id === item.id);
  }

  toggleItem(item: any) {
    if (this.isSelected(item)) {
      this.selectedTasinmazlar = this.selectedTasinmazlar.filter(x => x.id !== item.id);
    } else {
      this.selectedTasinmazlar.push(item);
    }
  }

  isAllSelected(): boolean {
    return this.filteredTasinmazlar.length > 0 &&
           this.selectedTasinmazlar.length === this.filteredTasinmazlar.length;
  }

  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedTasinmazlar = checked ? [...this.filteredTasinmazlar] : [];
  }

  deleteSelected() {
    const count = this.selectedTasinmazlar.length;
    const toast = this.toastr.warning(
      count === 1
        ? 'Seçili taşınmaz silinecek.<br><strong>Onaylamak için tıklayın.</strong>'
        : `${count} taşınmaz silinecek.<br><strong>Onaylamak için tıklayın.</strong>`,
      'Onay Gerekli',
      { enableHtml: true, closeButton: true, timeOut: 0, tapToDismiss: false }
    );

    toast.onTap.subscribe(() => {
      this.selectedTasinmazlar.forEach(item =>
        this.tasinmazService.delete(item.id).subscribe()
      );
      this.tasinmazlar = this.tasinmazlar.filter(
        t => !this.selectedTasinmazlar.some(s => s.id === t.id)
      );
      this.filteredTasinmazlar = this.tasinmazlar;
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

  exportExcel() {
    const data = this.selectedTasinmazlar.length > 0
      ? this.selectedTasinmazlar
      : this.filteredTasinmazlar;
    const fileName = this.selectedTasinmazlar.length > 0
      ? 'secili_tasinmazlar.xlsx'
      : 'tasinmazlar.xlsx';
    this.exportService.exportExcel(data, fileName, 'Tasinmazlar');
    this.toastr.success('Excel aktarıldı');
  }

  async exportPdf() {
    const data = this.selectedTasinmazlar.length > 0
      ? this.selectedTasinmazlar
      : this.filteredTasinmazlar;

    const fileName = data === this.filteredTasinmazlar
      ? 'tasinmazlar.pdf'
      : 'secili_tasinmazlar.pdf';

    const headers = [
      'Kullanıcı', 'İl', 'İlçe', 'Mahalle',
      'Ada', 'Parsel', 'Adres', 'Tip', 'Tarih'
    ];

    const rows = data.map(t => [
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
        : ''
    ]);

    const images = await Promise.all(
      data.map(t =>
        this.getBase64ImageFromURL(`${this.apiUrl}/api/Tasinmaz/${t.id}/image`)
          .catch(() => this.getBase64ImageFromURL('assets/no-image.png'))
      )
    );

    this.exportService.exportPdfWithImages('Taşınmaz Listesi', headers, rows, images, fileName);
    this.toastr.success('PDF aktarıldı');
  }

  onImageError(event: any) {
    event.target.onerror = null;
    event.target.src = 'assets/no-image.png';
  }

  private getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = url;
    });
  }
}
