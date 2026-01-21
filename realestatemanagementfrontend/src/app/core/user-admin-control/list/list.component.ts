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
  filteredUsers: any[] = [];
  selectedUsers: any[] = [];
  
  filterCriteria = {
    adSoyad: '',
    email: '',
    rol: ''
  };

  constructor(
    private userService: AdminControlService,
    private toastr: ToastrService,
    private router: Router,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (x) => {
        this.users = x;
        this.applyFilter();
      },
      error: () => this.toastr.error('Kullanıcılar yüklenemedi'),
    });
  }

  applyFilter() {
    this.filteredUsers = this.users.filter((u) => {
      const nameMatch = !this.filterCriteria.adSoyad || 
                        u.adSoyad.toLowerCase().includes(this.filterCriteria.adSoyad.toLowerCase());
      
      const emailMatch = !this.filterCriteria.email || 
                         u.email.toLowerCase().includes(this.filterCriteria.email.toLowerCase());
      
      const rolMatch = !this.filterCriteria.rol || u.rol === this.filterCriteria.rol;

      return nameMatch && emailMatch && rolMatch;
    });
    this.selectedUsers = [];
  }

  resetFilters() {
    this.filterCriteria = { adSoyad: '', email: '', rol: '' };
    this.applyFilter();
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

  isAllSelected(): boolean {
    return (
      this.filteredUsers.length > 0 &&
      this.selectedUsers.length === this.filteredUsers.length
    );
  }

  toggleSelectAll(event: any) {
    this.selectedUsers = event.target.checked ? [...this.filteredUsers] : [];
  }

  deleteSelected() {
    if (this.selectedUsers.length === 0) {
      this.toastr.info("Lütfen silmek istediğiniz kullanıcıları seçin.");
      return;
    }

    const count = this.selectedUsers.length;
    const toast = this.toastr.warning(
      `Seçili ${count} kullanıcı silinecek. Onaylamak için buraya tıklayın.`,
      'Onay Gerekli',
      { enableHtml: true, timeOut: 0, tapToDismiss: false }
    );

    toast.onTap.subscribe(() => {
      const ids = this.selectedUsers.map((u) => u.id);
      ids.forEach((id) => {
        this.userService.deleteUser(id).subscribe({
          next: (res: any) => {
            if (res.selfDeleted) {
              localStorage.clear();
              this.router.navigate(['/login']);
            }
          },
        });
      });

      this.users = this.users.filter(u => !ids.includes(u.id));
      this.applyFilter();
      this.selectedUsers = [];
      this.toastr.success('Silme işlemi tamamlandı');
    });
  }

  goToUpdate() {
    if (this.selectedUsers.length === 0) {
      this.toastr.info("Lütfen güncellemek istediğiniz kullanıcıyı seçin.");
      return;
    }
    
    if (this.selectedUsers.length > 1) {
      this.toastr.warning("Aynı anda sadece bir kullanıcıyı güncelleyebilirsiniz.");
      return;
    }

    this.router.navigate(['/core/admin/update', this.selectedUsers[0].id]);
  }

  exportExcel() {
    const rawData = this.selectedUsers.length > 0 ? this.selectedUsers : this.filteredUsers;
    const data = rawData.map(({ token, ...rest }) => rest);
    this.exportService.exportExcel(data, 'kullanicilar.xlsx', 'Kullanicilar');
  }

  exportPdf() {
    const rawData = this.selectedUsers.length > 0 ? this.selectedUsers : this.filteredUsers;
    const headers = ['Id', 'Ad Soyad', 'Email', 'Rol'];
    const rows = rawData.map((u) => [u.id, u.adSoyad, u.email, u.rol]);
    this.exportService.exportPdf('Kullanıcı Listesi Raporu', headers, rows, 'kullanicilar.pdf');
  }
}