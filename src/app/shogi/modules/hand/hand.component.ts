import {Component, Input} from '@angular/core';
import {getSvg, Koma, KomaType, PlayerType} from '../../interfaces/koma';
import {MatBadge} from '@angular/material/badge';
import {BoardEventBusServiceService} from '../../services/board-event-bus-service.service';

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
  boardEventBusService: BoardEventBusServiceService;

  protected readonly getSvg = getSvg;

  constructor(boardEventBusService: BoardEventBusServiceService) {
    this.boardEventBusService = boardEventBusService;
  }

  onDragStart(koma: Koma) {
    this.boardEventBusService.selectKoma(koma);
  }

}
