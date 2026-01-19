import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminControlService } from '../admin-control.service';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  users: any[] = [];
  selectedUsers: any[] = [];

  constructor(
    private userService: AdminControlService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (x) => (this.users = x),
      error: () => this.toastr.error('Kullanıcılar yüklenemedi'),
    });
  }

  isSelected(user: any): boolean {
    return this.selectedUsers.some((u) => u.id === user.id);
  }

  toggleUser(user: any) {
    if (this.isSelected(user)) {
      this.selectedUsers = this.selectedUsers.filter((u) => u.id !== user.id);
    } else {
      this.selectedUsers.push(user);
    }
  }

  deleteSelected() {
    const count = this.selectedUsers.length;

    const toast = this.toastr.warning(
      count === 1
        ? 'Seçili kullanıcı silinecek. <br><strong>Onaylamak için buraya tıklayın.</strong>'
        : `${count} kullanıcı silinecek. <br><strong>Onaylamak için buraya tıklayın.</strong>`,
      'Onay Gerekli',
      {
        enableHtml: true,
        closeButton: true,
        timeOut: 0,
        extendedTimeOut: 0,
        tapToDismiss: false,
      },
    );

    toast.onTap.subscribe(() => {
      const ids = this.selectedUsers.map((u) => u.id);

      ids.forEach((id) => {
        this.userService.deleteUser(id).subscribe({
          next: (res: any) => {
            if (res.selfDeleted) {
              localStorage.clear();
              this.router.navigate(['/login']);
              this.toastr.info('Hesabınız silindi, çıkış yapıldı');
            }
          },
        });
      });

      this.users = this.users.filter((u) => !ids.includes(u.id));
      this.selectedUsers = [];

      this.toastr.success(
        count === 1 ? 'Kullanıcı silindi' : 'Kullanıcılar silindi',
      );
    });
  }

  goToUpdate() {
    this.router.navigate(['/core/admin/update', this.selectedUsers[0].id]);
  }

  get deleteButtonText(): string {
    return this.selectedUsers.length > 1
      ? `Sil (${this.selectedUsers.length})`
      : 'Sil';
  }

  isAllSelected(): boolean {
    return (
      this.users.length > 0 && this.selectedUsers.length === this.users.length
    );
  }

  toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.selectedUsers = [...this.users];
    } else {
      this.selectedUsers = [];
    }
  }

  exportExcel() {
    const data =
      this.selectedUsers.length > 0 ? this.selectedUsers : this.users;

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Kullanıcılar');
    XLSX.writeFile(
      wb,
      this.selectedUsers.length > 0
        ? 'secili_kullanicilar.xlsx'
        : 'kullanicilar.xlsx',
    );

    this.toastr.success(
      this.selectedUsers.length > 0
        ? 'Seçili kullanıcılar Excel’e aktarıldı'
        : 'Tüm kullanıcılar Excel’e aktarıldı',
    );
  }

  exportPdf() {
    const data =
      this.selectedUsers.length > 0 ? this.selectedUsers : this.users;

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4',
    });

    doc.setFontSize(18);
    doc.text(
      this.selectedUsers.length > 0
        ? 'Seçili Kullanıcılar'
        : 'Kullanıcı Listesi',
      40,
      40,
    );

    autoTable(doc, {
      startY: 60,
      head: [['Id', 'Ad Soyad', 'Email', 'Rol']],
      body: data.map((u) => [u.id, u.adSoyad, u.email, u.rol]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save(
      this.selectedUsers.length > 0
        ? 'secili_kullanicilar.pdf'
        : 'kullanicilar.pdf',
    );

    this.toastr.success(
      this.selectedUsers.length > 0
        ? 'Seçili kullanıcılar PDF’e aktarıldı'
        : 'Tüm kullanıcılar PDF’e aktarıldı',
    );
  }
}
