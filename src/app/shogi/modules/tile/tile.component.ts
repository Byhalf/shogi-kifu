import {Component, Input} from '@angular/core';
import {Tile} from '../../interfaces/tile';
import {getSvg} from '../../interfaces/koma';
import {NgIf} from '@angular/common';
import {Subject, Subscription} from 'rxjs';
import {BoardEventBusServiceService} from '../../services/event-services/board-event-bus-service.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-shogi-tile',
  imports: [
    NgIf
  ],
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss', '../../styles/koma.scss']
})
export class TileComponent {

  @Input() tile: Tile = {x: -1, y: -1};
  safeSvg: SafeHtml = '';
  private drop$ = new Subject<Tile>();
  private httpSubscription: Subscription | undefined;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private boardEventBusService: BoardEventBusServiceService) {
  }

  ngOnInit() {
    if (this.tile.koma) {
      this.httpSubscription = this.http.get(getSvg(this.tile.koma), {responseType: 'text'}).subscribe({
        next: (svg) => {
          this.safeSvg = this.sanitizer.bypassSecurityTrustHtml(svg);
        },
        error: (error) => {
          console.error('Error fetching SVG:', error);
        },
        complete: () => {
        }
      });

    }
    console.log('helo')
  }

  ngOnDestroy() {
    this.httpSubscription?.unsubscribe();
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
