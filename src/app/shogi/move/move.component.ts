import {Component, Input} from '@angular/core';
import {Move, movementType} from '../interfaces/move';
import {Koma} from '../interfaces/koma';

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
  piece: Koma = {
    player: 'sente',
    kind: 'p'
  };
  @Input()
  promotion?: boolean;

  protected getWesterNotation() {
    return `${this.piece.kind}${this.origin ? `${this.origin.x}${this.origin.y}` : ''}${this.movement}${(this.destination.x + 1)}${(this.destination.y + 1)}${this.promotion ? '+' : ''}`;
  }

}
