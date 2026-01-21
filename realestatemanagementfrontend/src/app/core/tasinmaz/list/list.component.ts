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

  filterCriteria = {
    user: '',
    il: '',
    ilce: '',
    mahalle: '',
    nitelik: '',
    ada: '',
    parsel: ''
  };

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

      this.tasinmazlar = x
        .sort((a, b) =>
          new Date(b.olusturmaTarihi).getTime() -
          new Date(a.olusturmaTarihi).getTime()
        )
        .map(item => ({
          ...item,
          cacheBuster: ts
        }));

      this.filteredTasinmazlar = this.tasinmazlar;
    },
    error: () => this.toastr.error('Taşınmazlar yüklenemedi'),
  });
}


  applyFilter() {
    this.filteredTasinmazlar = this.tasinmazlar.filter((x) => {
      const matchUser = !this.filterCriteria.user || x.adSoyad === this.filterCriteria.user;
      const matchIl = !this.filterCriteria.il || x.ilAdi === this.filterCriteria.il;
      const matchIlce = !this.filterCriteria.ilce || x.ilceAdi === this.filterCriteria.ilce;
      const matchMahalle = !this.filterCriteria.mahalle || x.mahalleAdi === this.filterCriteria.mahalle;
      const matchNitelik = !this.filterCriteria.nitelik || x.emlakTipi === this.filterCriteria.nitelik;
      const matchAda = !this.filterCriteria.ada || x.ada?.toString() === this.filterCriteria.ada;
      const matchParsel = !this.filterCriteria.parsel || x.parsel?.toString() === this.filterCriteria.parsel;

      return matchUser && matchIl && matchIlce && matchMahalle && matchNitelik && matchAda && matchParsel;
    });
    this.selectedTasinmazlar = [];
  }

  getUniqueValues(column: string, filterBy?: string, filterValue?: any) {
    let data = this.tasinmazlar;
    if (filterBy && filterValue) {
      data = data.filter(x => x[filterBy] === filterValue);
    }
    return [...new Set(data.map(i => i[column]))].filter(val => val !== null && val !== undefined && val !== '').sort();
  }

  resetFilters() {
    this.filterCriteria = { user: '', il: '', ilce: '', mahalle: '', nitelik: '', ada: '', parsel: '' };
    this.applyFilter();
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
    if (this.selectedTasinmazlar.length === 0) {
      this.toastr.info("Lütfen silmek istediğiniz taşınmazları seçin.");
      return;
    }
    const count = this.selectedTasinmazlar.length;
    const toast = this.toastr.warning(
      count === 1 ? 'Seçili taşınmaz silinecek.' : `${count} taşınmaz silinecek.`,
      'Onay Gerekli',
      { enableHtml: true, closeButton: true, timeOut: 0, tapToDismiss: false }
    );
    toast.onTap.subscribe(() => {
      this.selectedTasinmazlar.forEach(item => this.tasinmazService.delete(item.id).subscribe());
      this.tasinmazlar = this.tasinmazlar.filter(t => !this.selectedTasinmazlar.some(s => s.id === t.id));
      this.applyFilter();
      this.selectedTasinmazlar = [];
      this.toastr.success('Silme işlemi tamamlandı');
    });
  }

  goToUpdate() {
    if (this.selectedTasinmazlar.length === 0) {
      this.toastr.info("Lütfen güncellemek istediğiniz taşınmazı seçin.");
      return;
    }
    if (this.selectedTasinmazlar.length > 1) {
      this.toastr.warning("Aynı anda sadece bir taşınmazı güncelleyebilirsiniz.");
      return;
    }
    const id = this.selectedTasinmazlar[0].id;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const url = user?.rol === 'Admin' ? ['/core/admin/tasinmaz/update', id] : ['/core/tasinmaz/update', id];
    this.router.navigate(url);
  }

  exportExcel() {
    const source = this.selectedTasinmazlar.length > 0 ? this.selectedTasinmazlar : this.filteredTasinmazlar;
    const data = source.map(t => ({
      Kullanici: t.adSoyad, Il: t.ilAdi, Ilce: t.ilceAdi, Mahalle: t.mahalleAdi,
      Ada: t.ada, Parsel: t.parsel, Tip: t.emlakTipi, Tarih: t.olusturmaTarihi ? new Date(t.olusturmaTarihi).toLocaleDateString() : ''
    }));
    this.exportService.exportExcel(JSON.parse(JSON.stringify(data)), 'tasinmazlar.xlsx', 'Tasinmazlar');
    this.toastr.success('Excel aktarıldı');
  }

  async exportPdf() {
    const data = this.selectedTasinmazlar.length > 0 ? this.selectedTasinmazlar : this.filteredTasinmazlar;
    const headers = ['Kullanıcı', 'İl', 'İlçe', 'Mahalle', 'Ada', 'Parsel', 'Tip', 'Tarih'];
    const rows = data.map(t => [
      t.adSoyad, t.ilAdi, t.ilceAdi, t.mahalleAdi, t.ada, t.parsel, t.emlakTipi,
      t.olusturmaTarihi ? new Date(t.olusturmaTarihi).toLocaleDateString() : ''
    ]);
    const images = await Promise.all(data.map(t => this.getBase64ImageFromURL(`${this.apiUrl}/api/Tasinmaz/${t.id}/image`).catch(() => this.getBase64ImageFromURL('assets/no-image.png'))));
    this.exportService.exportPdfWithImages('Taşınmaz Listesi', headers, rows, images, 'tasinmazlar.pdf');
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
        canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = url;
    });
  }
}