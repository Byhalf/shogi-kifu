import {Component, computed, DestroyRef, Signal} from '@angular/core';

import {TileComponent} from '../tile/tile.component';
import {Tile} from '../../interfaces/tile';
import {Koma, promotePiece} from '../../interfaces/koma';
import {HandComponent} from '../hand/hand.component';
import {Move} from '../../interfaces/move';
import {MovementService} from '../../services/movement.service';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {ShogiBoard} from '../../shogi-logic/shogi-board';
import {BoardEventBusServiceService} from '../../services/board-event-bus-service.service';

@Component({
  selector: 'shogi-board',
  imports: [TileComponent, HandComponent, MatIcon, MatIconButton, MatIconButton],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {

  private movementService: MovementService;
  protected shogiBoard: ShogiBoard;
  private readonly destroyRef: DestroyRef;
  protected boardView: Signal<Tile[]>;
  private boardEventBusService: BoardEventBusServiceService;

  constructor(movementService: MovementService, boardEventBusService: BoardEventBusServiceService, destroyRef: DestroyRef) {
    this.movementService = movementService;
    this.destroyRef = destroyRef;
    this.shogiBoard = new ShogiBoard(movementService);
    this.boardEventBusService = boardEventBusService;
    this.boardView = this.convertBoardToBoardView(this.shogiBoard.boardTiles);

  }

  private convertBoardToBoardView(board: (Koma | undefined)[][]): Signal<Tile[]> {
    return computed(() => {
      const tiles: Tile[] = [];
      for (let x = 0; x < board.length; x++) {
        // Safety check for undefined rows
        if (!board[x]) continue;
        for (let y = 0; y < board[x].length; y++) {
          tiles.push({
            x,
            y,
            koma: board[x][y]
          });
        }
      }
      return tiles;
    });
  }

  ngOnInit() {
    // Handle tile moves
    this.boardEventBusService.moveAttempt$.subscribe({
      next: ({from, to}) => {
        this.shogiBoard.moveKomaOnBoard(from, to);
      }
    });

    // Handle koma moves
    this.boardEventBusService.komaMoveAttempt$.subscribe({
      next: ({koma, to}) => {
        this.shogiBoard.dropKomaFromHand(koma, to);
      }
    });

    this.boardEventBusService.promotionAttempt$.subscribe(
      {
        next: (tile) => {
          this.shogiBoard.promoteKoma(tile);
        }
      }
    )

    //update view
    this.movementService.movements$.subscribe({
      next: ((move: Move) => {
          this.applyMove(move);
        }
      )
    });
  }


  public applyMove(move: Move) {
    let newTile: Tile = {
      koma: {
        player: move.player,
        kind: move.promotion === "*" ?
          promotePiece(move.koma) : move.koma
      },
      x: move.destination.x, y: move.destination.y
    };
    this.boardView()[newTile.x * 9 + newTile.y] = (newTile);
    if (move.origin) {
      this.boardView()[move.origin.x * 9 + move.origin.y] = {x: move.origin.x, y: move.origin.y};
    }
  }

}

