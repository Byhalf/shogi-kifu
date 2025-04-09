import {Component} from '@angular/core';
import {MovementService} from '../../services/event-services/movement.service';
import {Move} from '../../interfaces/move';
import {MoveComponent} from '../move/move.component';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {ShogiBoard} from '../../services/shogi-logic/shogi-board';

@Component({
  selector: 'app-move-list',
  imports: [
    MoveComponent,
    AsyncPipe,
    MatIcon,
    MatIconButton,
  ],
  templateUrl: './move-list.component.html',
  styleUrl: './move-list.component.scss'
})
export class MoveListComponent {
  private movementService: MovementService;
  protected movesHistory$: Observable<Move[]>;
  protected shogiBoard: ShogiBoard;

  constructor(movementService: MovementService, shogiBoard: ShogiBoard) {
    this.movementService = movementService;
    this.movesHistory$ = this.movementService.moveHistory$;
    this.shogiBoard = shogiBoard;
  }

  exportGame(): void {
    const fileName = 'shogi_game.csa'
    const content = this.shogiBoard.exportGameToCsa();
    const blob = new Blob([content], {type: 'text/plain'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();

    window.URL.revokeObjectURL(url);
  }
}
