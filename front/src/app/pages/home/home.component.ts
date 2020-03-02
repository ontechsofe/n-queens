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
  size: number;
  epoch: number;

  constructor(private geneticService: GeneticService) {
    this.size = 8;
    this.reset();

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
    console.log(this.solutions);
    this.subscription.unsubscribe();
    this.geneticService.disconnect();
  }

  evolutionView(epoch: number, entity: number): void {
    --epoch;
    --entity;
    if (this.evolution[epoch] !== undefined) {
      this.epoch = epoch;
    } else {
      this.epoch = 0;
    }
    this.eventsSubject.next(this.evolution[this.epoch].population[entity]);
  }

  solutionsView(solution: number): void {
    --solution;
    if (this.solutions.length > 0 && this.solutions[solution]) {
      this.eventsSubject.next(this.solutions[solution]);
    }
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

  get solutions(): number[][] {
    const flatSolutions = [];
    const allSolutions = this.evolution.map(epoch => epoch.solutions);
    allSolutions.forEach(epochSol => {
      epochSol.forEach(sol => {
        flatSolutions.push(sol);
      });
    });
    return flatSolutions;
  }

  get numSolutions(): number {
    const solutionsLengths = this.evolution.map(epoch => epoch.solutions.length);
    return solutionsLengths.reduce((a, b) => a + b, 0);
  }
}
