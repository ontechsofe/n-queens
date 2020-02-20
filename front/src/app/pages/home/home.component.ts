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
  viewingSolutions: boolean;
  size: number;
  epoch: number;
  solutions: number[];

  constructor(private geneticService: GeneticService) {
    this.size = 8;
    this.reset();

    this.viewingSolutions = false;
    this.eventsSubject = new Subject<number[]>();
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

  private reset(): void {
    this.evolution = [];
    this.epoch = 0;
  }

  changeView(): void {
    this.viewingSolutions = !this.viewingSolutions;
  }

  changeBoardSize(size: number) {
    this.size = size;
    const positions = Array.from({length: this.size}, () => NaN);
    this.eventsSubject.next(positions);
  }

  isSubscribed(): boolean {
    if (!this.subscription) {
      return false;
    }
    return !this.subscription.closed;
  }

  calculate(): void {
    this.reset();
    this.geneticService.connect();
    this.subscription = this.geneticService.epoch.subscribe(data => {
      // HANDLE EPOCHS HERE
      this.evolution.push(data.data);
      // console.log(data.data);
    });
    console.log(`Starting calculation with size ${this.size}`);
    this.geneticService.calculate(this.size);
  }

  stopSubscription(): void {
    this.subscription.unsubscribe();
    this.geneticService.disconnect();
  }

  evolutionView(epoch: number, entity: number): void {
    if (this.evolution[this.epoch] !== undefined) {
      this.epoch = epoch;
    } else {
      this.epoch = 0;
    }
    this.eventsSubject.next(this.evolution[this.epoch].population[entity]);
  }

  get epochs(): number {
    return this.evolution.length;
  }

  get entities(): number {
    const epochValues = this.evolution.filter((ep) => ep.epochId === this.epoch )[0];
    if (epochValues) {
      return epochValues.population.length;
    }
    return 0;
  }
}
