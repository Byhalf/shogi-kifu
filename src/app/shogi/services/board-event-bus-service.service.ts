import {Injectable} from '@angular/core';
import {map, Subject, switchMap, takeUntil} from 'rxjs';
import {Tile} from '../interfaces/tile';
import {Koma} from '../interfaces/koma';

@Injectable({
  providedIn: 'root'
})
export class BoardEventBusServiceService {
  // Selection sources
  private tileSelected = new Subject<Tile>();
  private komaSelected = new Subject<Koma>();

  // Drop source
  private tileDropped = new Subject<{ from: Tile | Koma, to: Tile }>();

  // Combined move stream
  moveAttempt$ = this.tileSelected.pipe(
    switchMap(selectedTile =>
      this.tileDropped.pipe(
        takeUntil(this.tileSelected || this.komaSelected), // Reset if new selection occurs
        map(({to}) => ({
          from: selectedTile,
          to
        }))
      )
    )
  );

  // Koma-specific move stream
  komaMoveAttempt$ = this.komaSelected.pipe(
    switchMap(selectedKoma =>
      this.tileDropped.pipe(
        takeUntil(this.komaSelected || this.tileSelected), // Reset if new selection occurs
        map(({to}) => ({
          koma: selectedKoma,
          to
        }))
      )
    )
  );

  selectTile(tile: Tile) {
    this.tileSelected.next(tile);
  }

  selectKoma(koma: Koma) {
    this.komaSelected.next(koma);
  }

  dropOnTile(from: Tile | Koma, to: Tile) {
    this.tileDropped.next({from, to});
  }

  constructor() {
  }
}
