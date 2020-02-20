import { Component, OnInit } from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  eventsSubject: Subject<number[]>;
  positions: number[];
  viewingSolutions: boolean;
  epochs: number;
  entities: number;
  solutions: number;

  constructor() {
    this.viewingSolutions = true;
    this.eventsSubject = new Subject<number[]>();
    this.positions = Array.from({length: 8}, () => NaN);
  }

  ngOnInit(): void {
  }

  changeView(): void {
    this.viewingSolutions = !this.viewingSolutions;
  }

  changeBoardSize(size: number) {
    this.positions = Array.from({length: size}, () => NaN);
    // this.positions = Array.from({length: parseInt(size, 10)}, (v, i) => NaN);
    this.eventsSubject.next(this.positions);
  }
}
