import {Component, EventEmitter, Input, Output} from '@angular/core';
import {getSvg, Koma, KomaType, PlayerType} from '../interfaces/koma';
import {MatBadge} from '@angular/material/badge';

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
  @Input() komas = new Map<KomaType, number>([]);
  @Output() komaSelected = new EventEmitter<Koma>();
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
