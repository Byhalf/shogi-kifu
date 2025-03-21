import {Component, Input} from '@angular/core';
import {getSvg, Koma} from '../interfaces/koma';

@Component({
  selector: 'shogi-hand',
  imports: [],
  templateUrl: './hand.component.html',
  styleUrl: './hand.component.css'
})
export class HandComponent {
  @Input() komas: Koma[] = [];

  protected readonly getSvg = getSvg;
}
