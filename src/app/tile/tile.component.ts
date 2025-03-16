import { Component, HostListener, Input } from '@angular/core';
import { Tile } from '../tile';

@Component({
  selector: 'app-tile',
  imports: [],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.css',
})
export class TileComponent {
  getCoordinates() {
    console.log(`(${this.tile.x}, ${this.tile.y})`);
  }
  @Input() tile: Tile = { x: 0, y: 0 };
}
