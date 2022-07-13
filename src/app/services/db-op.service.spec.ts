import { TestBed } from '@angular/core/testing';

import { DbOpService } from './db-op.service';

describe('DbOpService', () => {
  let service: DbOpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbOpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
