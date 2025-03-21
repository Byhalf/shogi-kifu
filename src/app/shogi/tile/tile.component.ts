import { Component, Input, Output } from '@angular/core';
import { Tile } from '../interfaces/tile';
import {getSvg, Koma, KOMA_SVG_MAP} from '../interfaces/koma';
import {NgIf} from '@angular/common';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'shogi-tile',
  imports: [
    NgIf
  ],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.css',
})
export class TileComponent {

  @Input() tile: Tile = { x: -1, y: -1 };
  @Output() tileDropped  = new EventEmitter<Tile>();
  @Output() tileSelected  = new EventEmitter<Tile>();
  @Output() tileUnSelected  = new EventEmitter<Tile>();




  onDragStart(event: DragEvent, tile: Tile) {
    this.tileSelected.emit(tile);
  }

  onDrop(event: DragEvent, tile: Tile) {
    event.preventDefault();
    this.tileDropped.emit(tile);
  }
// required for onDrop firing
  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  onDragEnd($event: DragEvent) {
    $event.preventDefault();
    this.tileUnSelected.emit($event);
  }

  protected readonly getSvg = getSvg;
}
