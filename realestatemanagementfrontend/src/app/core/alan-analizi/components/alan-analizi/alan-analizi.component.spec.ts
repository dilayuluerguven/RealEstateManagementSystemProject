import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlanAnaliziComponent } from './alan-analizi.component';

describe('AlanAnaliziComponent', () => {
  let component: AlanAnaliziComponent;
  let fixture: ComponentFixture<AlanAnaliziComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlanAnaliziComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlanAnaliziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
