import {Component, EventEmitter, Input, Output} from '@angular/core';
import {getSvg, Koma, KomaUnpromoted, PlayerType} from '../interfaces/koma';
import {MatBadge} from '@angular/material/badge';
import {Tile} from '../interfaces/tile';

@Component({
  selector: 'shogi-hand',
  imports: [
    MatBadge,
  ],
  templateUrl: './hand.component.html',
  styleUrl: './hand.component.css'
})
export class HandComponent {
  @Input() player: PlayerType = 'gote';
  @Input() komas: Map<KomaUnpromoted, number> = new Map([]);
  @Output() komaSelected: EventEmitter<Koma> = new EventEmitter();
  @Output() komaUnSelected = new EventEmitter();

  protected readonly getSvg = getSvg;

  onDragStart( koma: Koma) {
    this.komaSelected.emit(koma);
  }
  onDragEnd($event: DragEvent) {
    $event.preventDefault();
    this.komaUnSelected.emit();
  }
}
