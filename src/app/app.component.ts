import {Component} from '@angular/core';
import {BoardComponent} from './shogi/modules/board/board.component';
import {MoveListComponent} from './shogi/modules/move-list/move-list.component';
import {MatToolbar} from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  imports: [BoardComponent, MoveListComponent, MatToolbar],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'shogi_kifu';
}
