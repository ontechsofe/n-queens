import { TestBed } from '@angular/core/testing';

import { GeneticService } from './genetic.service';

describe('GeneticService', () => {
  let service: GeneticService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneticService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
