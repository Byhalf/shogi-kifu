import {Component} from '@angular/core';

import {TileComponent} from '../tile/tile.component';
import {Tile} from '../interfaces/tile';
import {INITIAL_SHOGI_BOARD, isKomaUnpromoted, Koma, KomaType, promotePiece, unPromotePiece} from '../interfaces/koma';
import {HandComponent} from '../hand/hand.component';
import {Move, movementType} from '../interfaces/move';
import {map, merge, Subject, take, takeUntil, timer} from 'rxjs';
import {MovementService} from '../services/movement.service';

@Component({
  selector: 'shogi-board',
  imports: [TileComponent, HandComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {
  boardTiles: Tile[][] = [];
  senteKomas = new Map<KomaType, number>([]);
  goteKomas = new Map<KomaType, number>([]);
  private movementService: MovementService;
  private readonly size: number = 9;

  constructor(movementService: MovementService) {
    for (let y = 0; y < this.size; y++) {
      this.boardTiles[y] = []; // Initialize each row as an array
      for (let x = 0; x < this.size; x++) {
        this.boardTiles[y][x] = {x: x, y: y, koma: INITIAL_SHOGI_BOARD[y][x]};
      }
    }
    this.movementService = movementService;
  }

// I dislike this is not more stateless
  // I don't like that it's different Types koma/tile
  private selectedKomaFromHand: Koma | undefined;
  private selectedTile: Tile | undefined; //can I merge these two
  private selectedNewTile$ = new Subject<void>();
  // can I use an observable instead ?
  private doubleClickEvent$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  ngOnDestroy() {
    this.destroy$.next(); // Signals all subscriptions to complete
    this.destroy$.complete(); // Cleans up the subject itself
  }

  handleTileDrop(eventData: { event: Event, tile: Tile }): void {
    const {event, tile} = eventData;
    let moveDescription: Move | undefined;

    if (this.selectedTile) {
      moveDescription = this.updateBoardFromBoard(tile);
      if (moveDescription) { //moveDescription is defined only if valid move happened
        moveDescription = this.handleMovePromotion(tile, moveDescription);
      }
    }
    if (this.selectedKomaFromHand) {
      moveDescription = this.updateBoardFromHand(tile);
    }
    if (moveDescription) {
      this.movementService.pushMovement(moveDescription);
    }
  }

  private handleMovePromotion(tile: Tile, moveDescription: Move): Move {
    const completion$ = merge(
      this.doubleClickEvent$.pipe(
        map(() => 'doubleClick'),
        takeUntil(timer(700)) // Only accept within 700ms window
      ),
      this.selectedNewTile$.pipe(
        take(1),
        map(() => 'dragend')
      )
    ).pipe(
      take(1),
      takeUntil(this.destroy$)
    );

    completion$.subscribe((result) => {
      if (result === 'doubleClick' && moveDescription) {
        if (tile.koma && isKomaUnpromoted(tile.koma.kind)) {
          tile.koma.kind = promotePiece(tile.koma.kind);
        }
        moveDescription.promotion = true;
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
    this.doubleClickEvent$.next();
  }

  updateBoardFromHand(tile: Tile): Move | undefined {
    if (!this.selectedKomaFromHand || tile.koma) {
      return;
    }
    if (this.selectedKomaFromHand?.player == 'gote') {
      this.decreaseQuantityKoma(this.goteKomas, this.selectedKomaFromHand?.kind as KomaType)
    } else {
      this.decreaseQuantityKoma(this.senteKomas, this.selectedKomaFromHand?.kind as KomaType)
    }
    tile.koma = {kind: this.selectedKomaFromHand.kind, player: this.selectedKomaFromHand.player};
    this.selectedKomaFromHand = undefined;
    return {
      piece: tile.koma,
      movement: '*',
      destination: {x: tile.x, y: tile.y},
    };

  }

  updateBoardFromBoard(targetedTile: Tile): Move | undefined {
    let move: movementType = '-';
    // no self move or self eating
    if (!this.selectedTile) {
      return
    }
    if (this.selectedTile.y === targetedTile.y && this.selectedTile.x === targetedTile.x) {
      return;
    }
    if (this.selectedTile.koma?.player === targetedTile.koma?.player) {
      return;
    }

    // eat the koma
    if (targetedTile.koma) {
      move = "x";
      const komaType = unPromotePiece(targetedTile.koma.kind);
      if (targetedTile.koma.player === 'gote') {
        this.increaseQuantityKoma(this.senteKomas, komaType);
      } else if (targetedTile.koma.player === 'sente') {
        this.increaseQuantityKoma(this.goteKomas, komaType);
      }
    }

    // update the board
    targetedTile.koma = this.selectedTile.koma;
    let notation: Move = {
      piece: targetedTile.koma as Koma,
      origin: {x: this.selectedTile.x, y: this.selectedTile.y},
      movement: move,
      destination: {x: targetedTile.x, y: targetedTile.y},
    };

    this.selectedTile.koma = undefined;
    this.selectedTile = undefined;
    return notation;
  }

  private increaseQuantityKoma(komas: Map<KomaType, number>, komaType: KomaType) {
    const quantityInHand = (komas.get(komaType) || 0) + 1;
    komas.set(komaType, quantityInHand);
  }

  private decreaseQuantityKoma(komas: Map<KomaType, number>, komaType: KomaType) {
    let quantityInHand = komas.get(komaType);
    if (quantityInHand) {
      quantityInHand -= 1;
      if (quantityInHand === 0) {
        komas.delete(komaType);
        return;
      }
      komas.set(komaType, quantityInHand);
    }
  }
}

