import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Tile} from '../../interfaces/tile';
import {getSvg} from '../../interfaces/koma';
import {NgIf} from '@angular/common';
import {finalize, Subject, switchMap, takeUntil, tap, timer} from 'rxjs';

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
  @Output() tileDropped = new EventEmitter<{ event: Event, tile: Tile }>();
  @Output() tileSelected = new EventEmitter<Tile>();
  @Output() tileDoubleClicked = new EventEmitter<Tile>();

  private drop$ = new Subject<Tile>();
  private doubleClick$ = new Subject<Tile>();

  constructor() {
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


  onDragStart(event: DragEvent, tile: Tile) {
    this.tileSelected.emit(tile);
  }

  onDrop(event: DragEvent, tile: Tile) {
    event.preventDefault();
    this.drop$.next(tile);
    this.tileDropped.emit({event, tile});
  }

// required for onDrop firing
  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  protected readonly getSvg = getSvg;

  onDoubleClick(tile: Tile) {
    this.doubleClick$.next(tile);
  }
}
