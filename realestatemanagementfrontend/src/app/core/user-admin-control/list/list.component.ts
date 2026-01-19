import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminControlService } from '../admin-control.service';
import { ToastrService } from 'ngx-toastr';
import { ExportService } from 'src/app/shared/services/export.service';

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
    private exportService: ExportService
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
        ? 'Seçili kullanıcı silinecek.<br><strong>Onaylamak için buraya tıklayın.</strong>'
        : `${count} kullanıcı silinecek.<br><strong>Onaylamak için buraya tıklayın.</strong>`,
      'Onay Gerekli',
      {
        enableHtml: true,
        closeButton: true,
        timeOut: 0,
        extendedTimeOut: 0,
        tapToDismiss: false,
      }
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
        count === 1 ? 'Kullanıcı silindi' : 'Kullanıcılar silindi'
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
      this.users.length > 0 &&
      this.selectedUsers.length === this.users.length
    );
  }

  toggleSelectAll(event: any) {
    this.selectedUsers = event.target.checked ? [...this.users] : [];
  }

  exportExcel() {
    const rawData =
      this.selectedUsers.length > 0 ? this.selectedUsers : this.users;

    const data = rawData.map(({ token, ...rest }) => rest);

    const fileName =
      this.selectedUsers.length > 0
        ? 'secili_kullanicilar.xlsx'
        : 'kullanicilar.xlsx';

    this.exportService.exportExcel(data, fileName, 'Kullanicilar');

    this.toastr.success(
      this.selectedUsers.length > 0
        ? 'Seçili kullanıcılar Excel’e aktarıldı'
        : 'Tüm kullanıcılar Excel’e aktarıldı'
    );
  }

  exportPdf() {
    const rawData =
      this.selectedUsers.length > 0 ? this.selectedUsers : this.users;

    const data = rawData.map(({ token, ...rest }) => rest);

    const headers = ['Id', 'Ad Soyad', 'Email', 'Rol'];

    const rows = data.map((u) => [
      u.id,
      u.adSoyad,
      u.email,
      u.rol,
    ]);

    const fileName =
      this.selectedUsers.length > 0
        ? 'secili_kullanicilar.pdf'
        : 'kullanicilar.pdf';

    this.exportService.exportPdf(
      this.selectedUsers.length > 0
        ? 'Seçili Kullanıcılar'
        : 'Kullanıcı Listesi',
      headers,
      rows,
      fileName
    );

    this.toastr.success(
      this.selectedUsers.length > 0
        ? 'Seçili kullanıcılar PDF’e aktarıldı'
        : 'Tüm kullanıcılar PDF’e aktarıldı'
    );
  }
}
