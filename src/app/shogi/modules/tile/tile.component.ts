import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Tile} from '../../interfaces/tile';
import {getSvg} from '../../interfaces/koma';
import {NgIf} from '@angular/common';
import {finalize, Subject, switchMap, takeUntil, tap, timer} from 'rxjs';
import {BoardEventBusServiceService} from '../../services/board-event-bus-service.service';

@Component({
  selector: 'shogi-tile',
  imports: [
    NgIf
  ],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.css',
})
export class TileComponent {

  @Input() tile: Tile = {x: -1, y: -1};
  @Output() tileDoubleClicked = new EventEmitter<Tile>();

  private drop$ = new Subject<Tile>();
  private doubleClick$ = new Subject<Tile>();
  boardEventBusService: BoardEventBusServiceService;

  constructor(boardEventBusService: BoardEventBusServiceService) {
    this.boardEventBusService = boardEventBusService;

    this.drop$
      .pipe(
        switchMap((tile) =>
          timer(1000).pipe(
            takeUntil(this.doubleClick$.pipe(
              tap(() => this.tileDoubleClicked.emit(tile)) // Emit only if double-click happens
            )),
            finalize(() => {
              // This function will be called if the timer times out
              this.tileDoubleClicked.emit(undefined);
            })
          )
        )
      )
      .subscribe({
        complete: () => {
        }
      });
  }


  onDragStart(tile: Tile) {
    this.boardEventBusService.selectTile(tile);
  }

  onDrop(event: DragEvent, tile: Tile) {
    event.preventDefault();
    this.drop$.next(tile);
    this.boardEventBusService.dropOnTile(tile);
  }

// required for onDrop firing
  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  protected readonly getSvg = getSvg;

  onDoubleClick(tile: Tile) {
    this.boardEventBusService.promoteKomaAttempt(tile);
  }
}
