import {Component} from '@angular/core';

import {TileComponent} from '../tile/tile.component';
import {Tile} from '../interfaces/tile';
import {INITIAL_SHOGI_BOARD, Koma, KomaUnpromoted, promotePiece, unPromotePiece} from '../interfaces/koma';
import {HandComponent} from '../hand/hand.component';
import { Move, movementType} from '../interfaces/move';
import {fromEvent, map, merge, of, Subject, switchMap, take, takeUntil, timer} from 'rxjs';
import {subscribe} from 'node:diagnostics_channel';

@Component({
  selector: 'shogi-board',
  imports: [TileComponent, HandComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {
  boardTiles: Tile[][] = [];
  senteKomas = new Map<KomaUnpromoted, number>([]);
  goteKomas = new Map<KomaUnpromoted, number>([]);

  readonly width: number = 9;

  constructor() {
    for (let y = 0; y < this.width; y++) {
      this.boardTiles[y] = []; // Initialize each row as an array
      for (let x = 0; x < this.width; x++) {
        this.boardTiles[y][x] = {x: x, y: y, koma: INITIAL_SHOGI_BOARD[y][x]};
      }
    }
  }

// I dislike this is not more stateless
  // I don't like that it's different Types koma/tile
  private selectedKomaFromHand: Koma | undefined;
  private selectedTile: Tile | undefined;
  private selectedNewTile$ = new Subject<void>();
  private doubleClickDuringTimeout$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  ngOnDestroy() {
    this.destroy$.next(); // Signals all subscriptions to complete
    this.destroy$.complete(); // Cleans up the subject itself
  }

  handleTileDrop(eventData: { event: Event, tile: Tile }): void {
    const { event, tile } = eventData;
    let moveDescription:Move | undefined;

    if (this.selectedTile) {
      moveDescription = this.updateBoardFromBoard(tile);
      const completion$ = merge(
        this.doubleClickDuringTimeout$.pipe(
          map(() => 'doubleClick'),
          takeUntil(timer(1000)) // Only accept within 1 second window
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
        if (result === 'doubleClick') {
          tile.koma!.kind = promotePiece(tile.koma!.kind);
          moveDescription!.promotion = true
        }
      });


    }
    if( this.selectedKomaFromHand){
      moveDescription = this.updateBoardFromHand(tile);
    }
  }

  handleKomaSelectFromHand(koma: Koma): void {
    this.selectedKomaFromHand = koma;
  }

  handleTileSelectFromBoard(tile: Tile) {
    this.selectedTile = tile;
    this.selectedNewTile$.next();
  }


  handleTileDblClick(tile: Tile | undefined) {
    this.doubleClickDuringTimeout$.next();
    console.log('called doubleClickDuringTimeout$.next')// Trigger the double click subject
  }

  updateBoardFromHand(tile: Tile): Move | undefined {
    if(!this.selectedKomaFromHand || tile.koma){
      return;
    }
    if(this.selectedKomaFromHand?.player=='gote'){
      this.decreaseQuantityKoma(this.goteKomas,this.selectedKomaFromHand?.kind as KomaUnpromoted)
    }else{
      this.decreaseQuantityKoma(this.senteKomas,this.selectedKomaFromHand?.kind as KomaUnpromoted)
    }
    tile.koma = {kind :this.selectedKomaFromHand.kind , player:this.selectedKomaFromHand.player};
    this.selectedKomaFromHand = undefined;
    return {
      piece:tile.koma,
      movement:'*',
      destination:{x:tile.x, y:tile.y},
    };

  }

  updateBoardFromBoard( targetedTile: Tile):Move|undefined {
    let move : movementType = '-';
    // no self move or self eating
    if(!this.selectedTile) {return}
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
      if(targetedTile.koma.player === 'gote'){
        this.increaseQuantityKoma(this.senteKomas,komaType);
      } else if (targetedTile.koma.player === 'sente') {
        this.increaseQuantityKoma(this.goteKomas,komaType);
      }
    }

    // update the board
    targetedTile.koma = this.selectedTile.koma;
    let notation : Move = {
      piece:targetedTile.koma,
      origin:{x:this.selectedTile.x, y:this.selectedTile.y},
      movement:move,
      destination:{x:targetedTile.x, y:targetedTile.y},
    };

    this.selectedTile.koma = undefined;
    this.selectedTile = undefined;
    return notation;
  }

  private increaseQuantityKoma( komas :Map<KomaUnpromoted, number> ,  komaType: KomaUnpromoted){
    const quantityInHand = (komas.get(komaType) || 0) + 1;
    komas.set(komaType, quantityInHand);
  }

  private decreaseQuantityKoma( komas :Map<KomaUnpromoted, number> ,  komaType: KomaUnpromoted){
    let quantityInHand = komas.get(komaType);
    if(quantityInHand){
      quantityInHand -= 1;
      if(quantityInHand ===0){
        komas.delete(komaType);
        return;
      }
      komas.set(komaType, quantityInHand);
    }
  }


}

