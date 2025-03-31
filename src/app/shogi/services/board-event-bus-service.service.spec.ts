import { TestBed } from '@angular/core/testing';

import { BoardEventBusServiceService } from './board-event-bus-service.service';

describe('BoardEventBusServiceService', () => {
  let service: BoardEventBusServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardEventBusServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
