import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';

import { Observable, fromEvent, merge, debounceTime } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'angular-test-project';

  interval: any;
  timerPaused: Boolean = false;
  running: Boolean = false;
  counter: number = 0;
  seconds: number = 0;
  minutes: number = 0;

  stream$ = new Observable((observer) => {
    this.interval = setInterval(() => {
      observer.next(this.counter++);
    }, 1000);
  });

  @ViewChild('secondsText')
  secondsVal!: ElementRef;
  @ViewChild('minutesText')
  minutesVal!: ElementRef;
  @ViewChild('pauseButton')
  pauseButton!: ElementRef;

  onStartClick(event: any) {
    if (!this.running) {
      this.running = true;
      this.timerPaused =false
      this.stream$.subscribe((val) => {
        this.seconds++;
        this.secondsVal.nativeElement.textContent = `0${this.seconds} seconds`;

        if (this.seconds > 9) {
          this.secondsVal.nativeElement.textContent = `${this.seconds} seconds`;
        }
        if (this.seconds === 60) {
          this.minutes++;
          this.seconds = 0;
          this.minutesVal.nativeElement.textContent = `0${this.minutes} minutes :`;
          this.secondsVal.nativeElement.textContent = `0${this.seconds} seconds`;
        }

        if (this.minutes > 9) {
          this.minutesVal.nativeElement.textContent = `${this.minutes} minutes :`;
        }
      });
    }
  }

  onResetClick(event: any) {
    if (this.running || this.timerPaused) {
      clearInterval(this.interval);
      this.seconds = 0;
      this.minutes = 0;
      this.secondsVal.nativeElement.textContent = `0${this.seconds} seconds`;
      this.minutesVal.nativeElement.textContent = `0${this.minutes} minutes :`;
      this.running = false;
      this.timerPaused = false;
    }
  }

  ngAfterViewInit(): void {
    const pauseButton = this.pauseButton.nativeElement;
    const clickEvent = fromEvent<MouseEvent>(pauseButton, 'click');
    const dblClickEvent = fromEvent<MouseEvent>(pauseButton, 'dblclick');
    const eventsMerged = merge(clickEvent, dblClickEvent).pipe(
      debounceTime(500)
    );
    eventsMerged.subscribe((event) => {
      if (event.type === 'dblclick') {
        pauseButton.textContent = 'Pause';
        
        clearInterval(this.interval);
        this.timerPaused = true;
        this.running = false;
        return;
      }
      pauseButton.textContent = 'Press twice';
    });
  }
}