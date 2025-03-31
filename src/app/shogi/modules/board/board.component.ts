import {Component, computed, DestroyRef, Signal} from '@angular/core';

import {TileComponent} from '../tile/tile.component';
import {Tile} from '../../interfaces/tile';
import {Koma, promotePiece} from '../../interfaces/koma';
import {HandComponent} from '../hand/hand.component';
import {Move} from '../../interfaces/move';
import {map, merge, Subject, take, takeUntil, timer} from 'rxjs';
import {MovementService} from '../../services/movement.service';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {ShogiBoard} from '../../shogi-logic/shogi-board';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

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
// I dislike this is not more stateless
  // I don't like that it's different Types koma/tile
  private selectedKomaFromHand: Koma | undefined;
  private selectedTile: Tile | undefined; //can I merge these two
  private selectedNewTile$ = new Subject<void>();
  private doubleClickEvent$ = new Subject<Tile>();

  constructor(movementService: MovementService, destroyRef: DestroyRef) {
    this.movementService = movementService;
    this.destroyRef = destroyRef;
    this.shogiBoard = new ShogiBoard(movementService);
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


  handleTileDrop(eventData: { event: Event, tile: Tile }): void {
    const {event, tile} = eventData;


  }

  private handleMovePromotion(tile: Tile, moveDescription: Move): Move {
    const completion$ = merge(
      this.selectedNewTile$.pipe(
        map(() => 'newSelect')
      ),
      this.doubleClickEvent$.pipe(
        takeUntil(timer(700)) // Only accept within 700ms window
      )
    ).pipe(
      take(1),
      takeUntilDestroyed(this.destroyRef)
    );

    completion$.subscribe((result) => {
      if (typeof result === typeof tile && moveDescription) {
        moveDescription = this.shogiBoard.promoteKoma(tile, moveDescription);
        if (tile.koma && moveDescription.promotion === "*") {
          tile.koma.kind = promotePiece(tile.koma.kind);
        }

      }
    });
    return moveDescription;
  }

  handleKomaSelectFromHand(koma: Koma): void {
    this.selectedKomaFromHand = koma;
  }

  handleTileSelectFromBoard(tile: Tile) {
    this.selectedTile = tile;
    this.selectedNewTile$.next();
  }


  handleTileDblClick(tile: Tile | undefined) {
    if (tile) {
      this.doubleClickEvent$.next(tile);
    }
  }

  updateBoardFromHand(tile: Tile) {
    this.shogiBoard.dropKomaFromHand(this.selectedKomaFromHand, tile);


  }


  public handleUndoClick() {

  }

}

