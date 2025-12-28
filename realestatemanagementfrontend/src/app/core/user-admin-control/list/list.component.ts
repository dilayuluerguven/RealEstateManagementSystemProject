import { Component, OnInit } from '@angular/core';
import { AdminControlService } from '../admin-control.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  users: any[] = [];
  constructor(private userService: AdminControlService) {}
  ngOnInit(): void {
    this.userService.getUsers().subscribe((x) => {
      this.users = x;
    });
  }
  deleteUser(id: number) {
    if (!confirm('Kullanıcı silinsin mi?')) return;

    this.userService.deleteUser(id).subscribe(() => {
      this.users = this.users.filter((u) => u.id !== id);
    });
  }
}
