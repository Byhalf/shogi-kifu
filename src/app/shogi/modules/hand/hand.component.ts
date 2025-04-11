import {Component, Input} from '@angular/core';
import {getSvg, Koma, KomaType, PlayerType} from '../../interfaces/koma';
import {MatBadge} from '@angular/material/badge';
import {BoardEventBusServiceService} from '../../services/event-services/board-event-bus-service.service';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'shogi-hand',
  imports: [
    MatBadge,
    NgStyle,
  ],
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss', '../../styles/koma.scss']
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
