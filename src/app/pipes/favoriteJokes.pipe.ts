import { Pipe, PipeTransform } from '@angular/core';
import { Joke } from '../models/joke';

@Pipe({ name: 'favoriteJokes' })
export class FavoriteJokesPipe implements PipeTransform {
  transform(jokes: Joke[] = [], favorite: boolean = false): Joke[] {
    if (!jokes) {
      return [];
    }
    return favorite
      ? jokes.filter(j => j.favorited)
      : jokes.filter(j => !j.favorited);
  }
}
