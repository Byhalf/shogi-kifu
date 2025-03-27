import {Component} from '@angular/core';
import {MovementService} from '../services/movement.service';
import {Move} from '../interfaces/move';
import {MoveComponent} from '../move/move.component';

@Component({
  selector: 'app-move-list',
  imports: [
    MoveComponent
  ],
  templateUrl: './move-list.component.html',
  styleUrl: './move-list.component.css'
})
export class MoveListComponent {
  private movementService: MovementService;
  protected moves: Move[] = [];

  constructor(movementService: MovementService) {
    this.movementService = movementService;
    this.movementService.movementsObservable$.subscribe(
      {
        next: move => {
          this.moves.push(move)
        },
        error(err) {
          console.error('something wrong occurred: ' + err);
        },
        complete() {
          console.log('done');
        },
      }
    )
  }
}
