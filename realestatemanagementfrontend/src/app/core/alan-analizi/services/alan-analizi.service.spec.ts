import { TestBed } from '@angular/core/testing';

import { AlanAnaliziService } from './alan-analizi.service';

describe('AlanAnaliziService', () => {
  let service: AlanAnaliziService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlanAnaliziService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
