import {Routes} from '@angular/router';
import {PlayAreaTournamentComponent} from './shogi/modules/play-area-tournament/play-area-tournament.component';

export const routes: Routes = [
  {path: '', component: PlayAreaTournamentComponent},
  {path: '**', redirectTo: ''}
];
