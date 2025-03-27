import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Move} from '../interfaces/move';

@Injectable({
  providedIn: 'root'
})
export class MovementService {
  private movements$ = new Subject<Move>();
  public movementsObservable$ = this.movements$.asObservable();
  
  constructor() {
  }

  pushMovement(move: Move) {
    this.movements$.next(move);
  }

}
