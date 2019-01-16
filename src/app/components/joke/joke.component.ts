import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Joke } from 'src/app/models/joke';

@Component({
  selector: 'app-joke',
  templateUrl: './joke.component.html',
  styleUrls: ['./joke.component.scss']
})
export class JokeComponent {
  @Input('joke') joke: Joke;
  @Output() delete = new EventEmitter<Joke>();
  @Output() favorite = new EventEmitter<Joke>();

  onDelete(): void {
    this.delete.emit(this.joke);
  }

  onFavorite(): void {
    this.favorite.emit(this.joke);
  }
}
