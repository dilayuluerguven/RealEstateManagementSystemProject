import { Component, OnInit } from '@angular/core';
import { TasinmazService } from '../tasinmaz.service';
import { TasinmazList } from '../models/tasinmaz-list';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  tasinmazlar: TasinmazList[] = [];
  selectedTasinmazlar: TasinmazList[] = [];
  isAdmin: boolean = false;

  constructor(
    private tasinmazService: TasinmazService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'Admin';

    this.getAll();
  }
  getAll() {
    this.tasinmazService.getAll().subscribe({
      next: (x) => {
        this.tasinmazlar = x;
      },
      error: () => {
        this.toastr.error('Taşınmazlar yüklenemedi');
      },
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
        ? 'Seçili taşınmaz silinsin mi?'
        : `${count} taşınmaz silinsin mi?`,
      'Onay',
      {
        closeButton: true,
        timeOut: 0,
        tapToDismiss: false,
      }
    );

    toast.onTap.subscribe(() => {
      this.selectedTasinmazlar.forEach((item) => {
        this.tasinmazService.delete(item.id).subscribe();
      });

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
    const role = localStorage.getItem('role');

    if (role === 'Admin') {
      this.router.navigate(['/core/admin/tasinmaz/update', id]);
    } else {
      this.router.navigate(['/core/tasinmaz/update', id]);
    }
  }

  get deleteButtonText(): string {
    return this.selectedTasinmazlar.length > 0
      ? `Sil (${this.selectedTasinmazlar.length})`
      : 'Sil';
  }
  isAllSelected(): boolean {
    return (
      this.tasinmazlar.length > 0 &&
      this.selectedTasinmazlar.length === this.tasinmazlar.length
    );
  }
  toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.selectedTasinmazlar = [...this.tasinmazlar];
    } else {
      this.selectedTasinmazlar = [];
    }
  }
}
