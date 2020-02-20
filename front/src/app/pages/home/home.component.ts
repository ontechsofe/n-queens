import { Component, OnInit } from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {GeneticService} from '../../services/genetic.service';
import {Epoch} from '../../types/genetic-evolution';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  subscription: Subscription;
  eventsSubject: Subject<number[]>;
  evolution: Epoch[];
  positions: number[];
  viewingSolutions: boolean;

  epoch: number;
  solutions: number[];

  constructor(private geneticService: GeneticService) {
    this.evolution = [];
    this.epoch = 0;

    this.viewingSolutions = false;
    this.eventsSubject = new Subject<number[]>();
    this.positions = Array.from({length: 8}, () => NaN);
  }

  ngOnInit(): void {
    this.geneticService.confirmation.subscribe(data => {
      if (data.success) {
        console.log('Connected to socket!');
      } else {
        console.log('Something went wrong when connecting to socket!');
      }
    });
  }

  changeView(): void {
    this.viewingSolutions = !this.viewingSolutions;
  }

  changeBoardSize(size: number) {
    this.positions = Array.from({length: size}, () => NaN);
    this.eventsSubject.next(this.positions);
  }

  isSubscribed(): boolean {
    if (!this.subscription) {
      return false;
    }
    return !this.subscription.closed;
  }

  calculate(): void {
    this.geneticService.connect();
    this.subscription = this.geneticService.epoch.subscribe(data => {
      // HANDLE EPOCHS HERE
      this.evolution.push(data.data);
    });
    const size = this.positions.length;
    console.log(`Starting calculation with size ${size}`);
    this.geneticService.calculate(size);
  }

  stopSubscription(): void {
    this.subscription.unsubscribe();
    this.geneticService.disconnect();
  }

  epochView(epoch: number): void {
    this.epoch = epoch;
  }

  get epochs(): number {
    return this.evolution.length;
  }

  get entities(): number {
    if (this.evolution.length > 0) {
      const epochValues = this.evolution.filter((ep) => ep.epochId === this.epoch )[0];
      return epochValues.population.length;
    }
    return 0;
  }
}
