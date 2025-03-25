import {Component} from '@angular/core';

import {TileComponent} from '../tile/tile.component';
import {Tile} from '../interfaces/tile';
import {INITIAL_SHOGI_BOARD, Koma, KomaUnpromoted, promotePiece, unPromotePiece} from '../interfaces/koma';
import {HandComponent} from '../hand/hand.component';

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
  selectedKomaFromHand: Koma | undefined;
  selectedTile: Tile | undefined;
  targetedTile: Tile | undefined; // I don't like it is modified differentlyn than the other too

  handleTileDrop(tile: Tile): void {
    if (this.selectedTile) {
      this.updateBoardFromBoard(tile);
    }
    if( this.selectedKomaFromHand){
      this.updateBoardFromHand(tile);
    }
  }

  handleTileUnselect() {
    this.selectedTile = undefined;
    this.selectedKomaFromHand = undefined;
  }

  handleKomaSelectFromHand(koma: Koma): void {
    this.selectedKomaFromHand = koma;
  }

  handleTileSelectFromBoard(tile: Tile) {
    this.selectedTile = tile;
  }

  handleTileDblClick(tile: Tile) {
    if(tile.koma && this.targetedTile){
      tile.koma.kind = promotePiece(tile.koma.kind)
    }this.targetedTile = undefined;
  }

  updateBoardFromHand(tile: Tile) {
    if(!this.selectedKomaFromHand || tile.koma){
      return;
    }
    if(this.selectedKomaFromHand?.player=='gote'){
      this.decreaseQuantityKoma(this.goteKomas,this.selectedKomaFromHand?.kind as KomaUnpromoted)
    }else{
      this.decreaseQuantityKoma(this.senteKomas,this.selectedKomaFromHand?.kind as KomaUnpromoted)
    }
    tile.koma = {kind :this.selectedKomaFromHand.kind , player:this.selectedKomaFromHand.player};
  }

  updateBoardFromBoard( targetedTile: Tile) {
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
      const komaType = unPromotePiece(targetedTile.koma.kind);
      if(targetedTile.koma.player === 'gote'){
        this.increaseQuantityKoma(this.senteKomas,komaType);
      } else if (targetedTile.koma.player === 'sente') {
        this.increaseQuantityKoma(this.goteKomas,komaType);
      }
    }

    // update the board
    targetedTile.koma = this.selectedTile.koma;
    this.selectedTile.koma = undefined;
    this.targetedTile = targetedTile;

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

