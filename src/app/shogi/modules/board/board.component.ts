import {Component, computed, DestroyRef, Signal} from '@angular/core';

import {TileComponent} from '../tile/tile.component';
import {Tile} from '../../interfaces/tile';
import {Koma, promotePiece, swapPlayer, unPromotePiece} from '../../interfaces/koma';
import {HandComponent} from '../hand/hand.component';
import {Move, MovementType} from '../../interfaces/move';
import {MovementService} from '../../services/event-services/movement.service';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {ShogiBoard} from '../../services/shogi-logic/shogi-board';
import {BoardEventBusServiceService} from '../../services/event-services/board-event-bus-service.service';
import {TileView} from '../../interfaces/TileView';

@Component({
  selector: 'shogi-board',
  imports: [TileComponent, HandComponent, MatIcon, MatIconButton, MatIconButton],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {

  private movementService: MovementService;
  protected shogiBoard: ShogiBoard;
  private readonly destroyRef: DestroyRef;
  protected boardView: Signal<TileView[]>;
  private boardEventBusService: BoardEventBusServiceService;

  constructor(movementService: MovementService, boardEventBusService: BoardEventBusServiceService, shogiBoard: ShogiBoard, destroyRef: DestroyRef) {
    this.movementService = movementService;
    this.destroyRef = destroyRef;
    this.shogiBoard = shogiBoard;
    this.boardEventBusService = boardEventBusService;
    this.boardView = this.convertBoardToBoardView(this.shogiBoard.boardTiles);

  }

  private convertBoardToBoardView(board: (Koma | undefined)[][]): Signal<Tile[]> {
    return computed(() => {
      const tiles: TileView[] = [];
      for (let y = 0; y < 9; y++) {
        // Safety check for undefined rows
        for (let x = 0; x < 9; x++) {
          tiles.push({
            x,
            y,
            koma: board[y][x]
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

  public handleUndoClick(): void {
    this.shogiBoard.undoMovement();
  }

  private undoMove(move: Move): void {
    if (move.origin) {
      let oldTile: Tile = {
        koma: {
          player: move.player,
          kind: move.promotion === "*" ?
            unPromotePiece(move.koma) : move.koma
        },
        x: move.origin.x,
        y: move.origin.y
      }
      this.boardView()[this.oneDtoTwoD(oldTile.x, oldTile.y)] = oldTile;
    }
    this.boardView()[this.oneDtoTwoD(move.destination.x, move.destination.y)]
      = move.eatenKoma ?
      {
        x: move.destination.x, y: move.destination.y,
        koma: {
          kind: move.eatenKoma,
          player: swapPlayer(move.player)
        }
      }
      : {x: move.destination.x, y: move.destination.y};
  }

  private makeMove(move: Move): void {
    let newTile: TileView = {
      koma: {
        player: move.player,
        kind: move.promotion === "*" ?
          promotePiece(move.koma) : move.koma
      },
      x: move.destination.x, y: move.destination.y,
      color: "blue"
    };
    this.boardView()[this.oneDtoTwoD(newTile.x, newTile.y)] = newTile;
    if (move.origin) {
      this.boardView()[this.oneDtoTwoD(move.origin.x, move.origin.y)] = {x: move.origin.x, y: move.origin.y};
    }
  }


  private applyMove(move: Move) {
    if (move.movement === MovementType.UNDO) {
      this.undoMove(move);
    } else {
      this.makeMove(move);
    }
  }

  private oneDtoTwoD(x: number, y: number): number {
    return y * 9 + x;
  }
}

