import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasinmazListMapComponent } from './tasinmaz-list-map.component';

describe('TasinmazListMapComponent', () => {
  let component: TasinmazListMapComponent;
  let fixture: ComponentFixture<TasinmazListMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasinmazListMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasinmazListMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
