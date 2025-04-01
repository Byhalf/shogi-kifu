import {Component} from '@angular/core';
import {MovementService} from '../../services/movement.service';
import {Move} from '../../interfaces/move';
import {MoveComponent} from '../move/move.component';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-move-list',
  imports: [
    MoveComponent,
    AsyncPipe
  ],
  templateUrl: './move-list.component.html',
  styleUrl: './move-list.component.css'
})
export class MoveListComponent {
  private movementService: MovementService;
  protected movesHistory$: Observable<Move[]>;

  constructor(movementService: MovementService) {
    this.movementService = movementService;
    this.movesHistory$ = this.movementService.moveHistory$;
  }
}
