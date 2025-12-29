import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminControlService } from '../admin-control.service';
import { ToastrService } from 'ngx-toastr';

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
    private router: Router
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
        ? 'Seçili kullanıcı silinsin mi?'
        : `${count} kullanıcı silinsin mi?`,
      'Onay',
      {
        closeButton: true,
        timeOut: 0,
        extendedTimeOut: 0,
        tapToDismiss: false,
      }
    );

    toast.onTap.subscribe(() => {
      const ids = this.selectedUsers.map((u) => u.id);

      ids.forEach((id) => {
        this.userService.deleteUser(id).subscribe();
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
      ? `Toplu Sil (${this.selectedUsers.length})`
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
}
