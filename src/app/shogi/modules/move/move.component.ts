import {Component, Input} from '@angular/core';
import {Move, movementType} from '../../interfaces/move';
import {KomaType, PlayerType} from '../../interfaces/koma';

@Component({
  selector: 'app-move',
  imports: [],
  template: `
    {{ this.getWesterNotation() }}
  `,
  styles: ``
})
export class MoveComponent implements Move {
  @Input()
  destination: { x: number; y: number } = {x: -1, y: -1};
  @Input()
  movement: movementType = "-";
  @Input()
  origin?: { x: number; y: number };
  @Input()
  koma: KomaType = 'p';
  @Input()
  player: PlayerType = 'sente';
  @Input()
  eatenKoma?: KomaType = 'p';


  @Input()
  promotion?: "*" | "=" | undefined;

  // I could write a custom pipe just for fun
  protected getWesterNotation() {
    return `${this.player === "sente" ? "☗" : "☖"}${this.koma}${this.origin ? `${this.origin.x + 1}${this.origin.y + 1}` : ''}${this.movement}${(this.destination.x + 1)}${(this.destination.y + 1)}${this.promotion || ''}`;
  }

}
