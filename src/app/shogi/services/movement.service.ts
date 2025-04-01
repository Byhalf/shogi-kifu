import {Injectable} from '@angular/core';
import {scan, Subject} from 'rxjs';
import {Move} from '../interfaces/move';

@Injectable({
  providedIn: 'root'
})

export class MovementService {


  public movements$ = new Subject<Move>();


  public moveHistory$ = this.movements$.pipe(
    scan((history: Move[], action) => {
      if (typeof action === 'string' && action === 'UNDO') {
        return history.slice(0, -1); // Remove last move (undo)
      } else {
        return [...history, action]; // Add move to history
      }
    }, [] as Move[])
  );

  constructor() {
  }

  /*unpushMovement() {
    this.movements$.next("UNDO");
  }*/

  pushMovement(move: Move) {
    this.movements$.next(move);
  }

}
