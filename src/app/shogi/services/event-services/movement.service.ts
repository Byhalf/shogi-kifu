import {Injectable} from '@angular/core';
import {scan, Subject} from 'rxjs';
import {Move, MovementType} from '../../interfaces/move';

@Injectable({
  providedIn: 'root'
})

export class MovementService {


  public movements$ = new Subject<Move>();


  public moveHistory$ = this.movements$.pipe(
    scan((history: Move[], move) => {
      if (move.movement === MovementType.UNDO) {
        return history.slice(0, -1); // Remove last move (undo)
      } else if (move.movement === MovementType.PROMOTE) {
        let moveToUpdate = history[history.length - 1];
        moveToUpdate.promotion = '*';
        return history;
      } else {
        return [...history, move]; // Add move to history
      }
    }, [] as Move[])
  );

  constructor() {
  }

  pushMovement(move: Move) {
    this.movements$.next(move);
  }

}
