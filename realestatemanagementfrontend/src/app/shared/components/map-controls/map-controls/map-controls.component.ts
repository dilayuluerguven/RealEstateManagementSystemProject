import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-map-controls',
  templateUrl: './map-controls.component.html'
})
export class MapControlsComponent {
  @Input() opacity = 1;
  @Output() opacityChange = new EventEmitter<number>();
}
