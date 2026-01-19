import { Component, OnInit } from '@angular/core';
import { TasinmazService } from '../tasinmaz.service';
import { TasinmazList } from '../models/tasinmaz-list';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
        (x) => x.id !== data.id,
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
      { enableHtml: true, closeButton: true, timeOut: 0, tapToDismiss: false },
    );

    toast.onTap.subscribe(() => {
      this.selectedTasinmazlar.forEach((item) =>
        this.tasinmazService.delete(item.id).subscribe(),
      );
      this.tasinmazlar = this.tasinmazlar.filter(
        (t) => !this.selectedTasinmazlar.some((s) => s.id === t.id),
      );
      this.selectedTasinmazlar = [];
      this.toastr.success('Silme işlemi tamamlandı');
    });
  }

  goToUpdate() {
    if (this.selectedTasinmazlar.length !== 1) return;
    const id = this.selectedTasinmazlar[0].id;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.router.navigate(
      user?.rol === 'Admin'
        ? ['/core/admin/tasinmaz/update', id]
        : ['/core/tasinmaz/update', id],
    );
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

  if (data.length === 0) {
    this.toastr.warning('Aktarılacak veri bulunamadı');
    return;
  }

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Tasinmazlar');

  const fileName =
    this.selectedTasinmazlar.length > 0
      ? 'secili_tasinmazlar.xlsx'
      : 'tasinmazlar.xlsx';

  XLSX.writeFile(wb, fileName);

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

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4',
    });
    doc.setFontSize(18);
    doc.text('Taşınmaz Listesi', 40, 40);

    autoTable(doc, {
      startY: 60,
      head: [
        [
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
        ],
      ],
      body: data.map((t) => [
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
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save(fileName);

    this.toastr.success(
      data === this.tasinmazlar
        ? 'Tüm taşınmazlar PDF’e aktarıldı'
        : 'Seçili taşınmazlar PDF’e aktarıldı',
    );
  }
}
