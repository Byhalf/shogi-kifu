import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Tile} from '../interfaces/tile';
import {getSvg} from '../interfaces/koma';
import {NgIf} from '@angular/common';
import {Subject, switchMap, takeUntil, tap, timer} from 'rxjs';
import {subscribe} from 'node:diagnostics_channel';

@Component({
  selector: 'shogi-tile',
  imports: [
    NgIf
  ],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileComponent {

  @Input() tile: Tile = { x: -1, y: -1 };
  @Output() tileDropped  = new EventEmitter<Tile>();
  @Output() tileSelected  = new EventEmitter<Tile>();
  @Output() tileUnSelected  = new EventEmitter();
  @Output() tileDoubleClicked = new EventEmitter<Tile>();


  private drop$ = new Subject<Tile>();
  private doubleClick$ = new Subject<Tile>();

  constructor() {
    this.drop$
      .pipe(
        switchMap((tile) =>
          timer(700).pipe(
            takeUntil(this.doubleClick$.pipe(
              tap(() => this.tileDoubleClicked.emit(tile)) // Emit only if double-click happens
            ))
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
    this.tileDropped.emit(tile);
  }
// required for onDrop firing
  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  onDragEnd($event: DragEvent) {
    $event.preventDefault();
    this.tileUnSelected.emit();
  }

  protected readonly getSvg = getSvg;

  onDoubleClick(tile: Tile) {
    this.doubleClick$.next(tile);
  }
}
