import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayAreaTournamentComponent } from './play-area-tournament.component';

describe('PlayAreaTournamentComponent', () => {
  let component: PlayAreaTournamentComponent;
  let fixture: ComponentFixture<PlayAreaTournamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayAreaTournamentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayAreaTournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
