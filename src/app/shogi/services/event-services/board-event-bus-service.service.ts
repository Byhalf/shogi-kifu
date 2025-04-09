import {Injectable} from '@angular/core';
import {EMPTY, exhaustMap, filter, map, merge, mergeMap, Subject, switchMap, take, takeUntil, timer} from 'rxjs';
import {Tile} from '../../interfaces/tile';
import {Koma} from '../../interfaces/koma';

@Injectable({
  providedIn: 'root'
})
export class BoardEventBusServiceService {
  //  sources
  private tileSelected = new Subject<Tile>();
  private komaSelected = new Subject<Koma>();
  private promoteKoma = new Subject<Tile>();
  private tileDropped = new Subject<Tile>();

  private cancellations = merge(this.tileSelected, this.komaSelected);

  // Combined move stream
  moveAttempt$ = this.tileSelected.pipe(
    switchMap(selectedTile =>
      this.tileDropped.pipe(
        takeUntil(this.cancellations), // Reset if new selection occurs
        map((to) => ({
          from: selectedTile,
          to
        }))
      )
    )
  );

  promotionAttempt$ = this.moveAttempt$.pipe(
    exhaustMap((move) => {
        return merge(
          this.promoteKoma.pipe(
            filter(koma => koma.x === move.to.x && koma.y === move.to.y),
            take(1)
          ),
          timer(1000).pipe(mergeMap(() => EMPTY))
        ).pipe(
          takeUntil(this.cancellations),
        );
      }
    )
  )
  // Koma-specific move stream
  komaMoveAttempt$ = this.komaSelected.pipe(
    switchMap(selectedKoma =>
      this.tileDropped.pipe(
        takeUntil(this.cancellations), // Reset if new selection occurs
        map((to) => ({
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

  dropOnTile(to: Tile) {
    this.tileDropped.next(to);
  }

  promoteKomaAttempt(tile: Tile) {
    this.promoteKoma.next(tile);
  }

  constructor() {
  }
}
