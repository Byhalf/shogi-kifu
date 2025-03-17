import { Component, HostListener, Input } from '@angular/core';
import { Tile } from '../interfaces/tile';
import {Koma, KOMA_SVG_MAP} from '../interfaces/koma';

@Component({
  selector: 'shogi-tile',
  imports: [],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.css',
})
export class TileComponent {
  getCoordinates() {
    console.log(`(${this.tile.x}, ${this.tile.y})`);
  }
  @Input() tile: Tile = { x: 0, y: 0 };

  getSvg(koma: Koma) {
    return KOMA_SVG_MAP[koma.type + '_'+koma.player];
  }
}
