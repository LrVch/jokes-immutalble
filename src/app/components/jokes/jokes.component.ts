import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Joke } from 'src/app/models/joke';

@Component({
  selector: 'app-jokes',
  templateUrl: './jokes.component.html'
})
export class JokesComponent {
  @Input('hasFavorited') hasFavorited: Joke[];
  @Input('jokes') jokes: Joke[];
  @Output() delete = new EventEmitter<Joke>();
  @Output() favorite = new EventEmitter<Joke>();

  trackById(joke) {
    return joke.id;
  }

  onDelete(joke: Joke): void {
    this.delete.emit(joke);
  }

  onFavorite(joke: Joke): void {
    this.favorite.emit(joke);
  }
}
