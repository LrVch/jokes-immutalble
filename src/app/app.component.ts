import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppStateService } from './services';
import { Observable } from 'rxjs';
import { Joke } from './models/joke';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  jokes$: Observable<Joke[]>;
  draftTitle$: Observable<string>;
  draftBody$: Observable<string>;
  hasFavorited$: Observable<boolean>;


  constructor(private appState: AppStateService) {
    const {
      jokes$,
      draftTitle$,
      draftBody$
    } = this.appState;

    this.draftTitle$ = draftTitle$;
    this.draftBody$ = draftBody$;
    this.jokes$ = jokes$;

    this.hasFavorited$ = jokes$.pipe(
      map(jokes => !!jokes.filter(j => j.favorited).length)
    );
  }

  onJoke(joke: Joke): void {
    this.appState.addJoke(joke);
  }

  onCached(joke: Joke): void {
    const {title, body} = joke;
    this.appState.setDraftTitle(title);
    this.appState.setDraftBody(body);
  }

  onDelete(joke: Joke): void {
    this.appState.removeJoke(joke);
  }

  onFavorite(joke: Joke): void {
    if (joke.favorited) {
      this.appState.unfavoriteJoke(joke);
    } else {
      this.appState.favoriteJoke(joke);
    }
  }
}
