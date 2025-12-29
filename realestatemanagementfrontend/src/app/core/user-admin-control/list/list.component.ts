import { Component, OnInit } from '@angular/core';
import { AdminControlService } from '../admin-control.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  users: any[] = [];

  constructor(
    private userService: AdminControlService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((x) => {
      this.users = x;
    });
  }

  deleteUser(id: number) {
  this.toastr.warning(
    'Kullanıcı siliniyor...',
    'Dikkat'
  );

  this.userService.deleteUser(id).subscribe({
    next: () => {
      this.users = this.users.filter(u => u.id !== id);
      this.toastr.success('Kullanıcı silindi');
    },
    error: () => {
      this.toastr.error('Silme işlemi başarısız');
    }
  });
}

}
