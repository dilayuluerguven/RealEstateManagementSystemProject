import { Component, OnInit } from '@angular/core';
import { TasinmazService } from '../tasinmaz.service';
import { Tasinmaz } from '../models/tasinmaz';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  tasinmazlar: Tasinmaz[] = [];

  constructor(private tasinmazService: TasinmazService) {}

  ngOnInit(): void {
    this.tasinmazService.getAll().subscribe(res => {
      console.log('res:', res);
      this.tasinmazlar = res;
    });
  }
}
