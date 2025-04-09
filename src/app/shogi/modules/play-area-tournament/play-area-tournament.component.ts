import {Component} from '@angular/core';
import {BoardComponent} from '../board/board.component';
import {MoveListComponent} from '../move-list/move-list.component';

@Component({
  selector: 'app-play-area-tournament',
  imports: [
    BoardComponent,
    MoveListComponent
  ],
  templateUrl: './play-area-tournament.component.html',
  styleUrl: './play-area-tournament.component.scss'
})
export class PlayAreaTournamentComponent {

}
