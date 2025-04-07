import {Component, Input} from '@angular/core';
import {Move, movementType} from '../../interfaces/move';
import {KomaType, PlayerType} from '../../interfaces/koma';
import {ShogiConverter} from '../../services/shogi-logic/shogi-converter';

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
    let coordinatesOrigin: { x: number, y: number } | undefined;
    if (this.origin) {
      coordinatesOrigin = ShogiConverter.virtualCoordinatesToReal(this.origin.x, this.origin.y);
    }
    const coordinatesDestination = ShogiConverter.virtualCoordinatesToReal(this.destination.x, this.destination.y);

    return `${this.player === "sente" ? "☗" : "☖"}${this.koma}${coordinatesOrigin ? `${coordinatesOrigin.x}${coordinatesOrigin.y}` : ''}${this.movement}${(coordinatesDestination.x)}${(coordinatesDestination.y)}${this.promotion || ''}`;
  }

}
