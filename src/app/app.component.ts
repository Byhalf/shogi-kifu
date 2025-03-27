import { Component } from '@angular/core';
import { BoardComponent } from './shogi/board/board.component';
import {MoveListComponent} from './shogi/move-list/move-list.component';

@Component({
  selector: 'app-root',
  imports: [BoardComponent, MoveListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'shogi_kifu';
}
