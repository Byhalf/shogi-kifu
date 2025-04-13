import {Component, Input} from '@angular/core';
import {Tile} from '../../interfaces/tile';
import {getSvg} from '../../interfaces/koma';
import {NgIf} from '@angular/common';
import {Subject} from 'rxjs';
import {BoardEventBusServiceService} from '../../services/event-services/board-event-bus-service.service';

@Component({
  selector: 'shogi-tile',
  imports: [
    NgIf
  ],
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss', '../../styles/koma.scss']
})
export class TileComponent {

  @Input() tile: Tile = {x: -1, y: -1};

  private drop$ = new Subject<Tile>();
  boardEventBusService: BoardEventBusServiceService;

  constructor(boardEventBusService: BoardEventBusServiceService) {
    this.boardEventBusService = boardEventBusService;


  }


  onDragStart(tile: Tile) {
    this.boardEventBusService.selectTile(tile);
  }

  onDrop(event: Event, tile: Tile) {
    event.preventDefault();
    this.drop$.next(tile);
    this.boardEventBusService.dropOnTile(tile);
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
  }

  dragOver(event: Event): void {
    // required for onDrop firing
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.add('drag-over');
  }

  dragLeave(event: DragEvent): void {
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
  }


  protected readonly getSvg = getSvg;

  onDoubleClick(tile: Tile) {
    this.boardEventBusService.promoteKomaAttempt(tile);
  }


}
