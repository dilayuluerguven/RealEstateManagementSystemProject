import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlanAnalizComponent } from '../alan-analizi/alan-analizi.component';

describe('AlanAnalizComponent', () => {
  let component: AlanAnalizComponent;
  let fixture: ComponentFixture<AlanAnalizComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlanAnalizComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlanAnalizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
