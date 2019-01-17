import { Injectable } from '@angular/core';
import { Joke } from '../models/joke';
import { Observable, Subject, merge } from 'rxjs';
import { AppState } from '../models/appState';
import { map, scan, startWith, tap } from 'rxjs/operators';
import { MapToState } from '../utils';
import { LocalstorageService } from './localstorage.service';
import { fromJS, Map } from 'immutable';

export interface ImmutableAppState extends Map<string, any> { }

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private appState$: Observable<ImmutableAppState>;
  private initialState: AppState;

  private addJokeSubject = new Subject<Joke>();
  private addJokeSubject$ = this.addJokeSubject.asObservable();
  private addJoke$: Observable<MapToState<ImmutableAppState>>;

  private removeJokeSubject = new Subject<Joke>();
  private removeJokeSubject$ = this.removeJokeSubject.asObservable();
  private removeJoke$: Observable<MapToState<ImmutableAppState>>;

  private favoriteJokeSubject = new Subject<Joke>();
  private favoriteJokeSubject$ = this.favoriteJokeSubject.asObservable();
  private favoriteJoke$: Observable<MapToState<ImmutableAppState>>;

  private unfavoriteJokeSubject = new Subject<Joke>();
  private unfavoriteJokeSubject$ = this.unfavoriteJokeSubject.asObservable();
  private unfavoriteJoke$: Observable<MapToState<ImmutableAppState>>;

  private setdraftTitleSubject = new Subject<string>();
  private setdraftTitleSubject$ = this.setdraftTitleSubject.asObservable();
  private setdraftTitle$: Observable<MapToState<ImmutableAppState>>;

  private setdraftBodySubject = new Subject<string>();
  private setdraftBodySubject$ = this.setdraftBodySubject.asObservable();
  private setdraftBody$: Observable<MapToState<ImmutableAppState>>;

  jokes$: Observable<Joke[]>;
  draftTitle$: Observable<string>;
  draftBody$: Observable<string>;

  constructor(
    private localstorageService: LocalstorageService
  ) {
    this.initialState = {
      jokes: this.localstorageService.getJokes() || [],
      draftTitle: this.localstorageService.getDrafteTitle() || '',
      draftBody: this.localstorageService.getDrafteBody() || ''
    };

    this.addJoke$ = this.addJokeSubject$.pipe(
      map((joke: Joke) =>
        (state: ImmutableAppState) =>
          state.set('jokes', state.get('jokes').push(Map({ ...joke })))
      )
    );

    this.removeJoke$ = this.removeJokeSubject$.pipe(
      map((joke: Joke) =>
        (state: ImmutableAppState) =>
          state.set('jokes', state.get('jokes').filter(j => j.get('id') !== joke.id))
      )
    );

    this.favoriteJoke$ = this.favoriteJokeSubject$.pipe(
      map((joke: Joke) =>
        (state: ImmutableAppState) =>
          state.set('jokes', state.get('jokes').map(j => j.get('id') === joke.id ? j.set('favorited', true) : j))
      )
    );

    this.unfavoriteJoke$ = this.unfavoriteJokeSubject$.pipe(
      map((joke: Joke) =>
        (state: ImmutableAppState) =>
          state.set('jokes', state.get('jokes').map(j => j.get('id') === joke.id ? j.set('favorited', false) : j))
      )
    );

    this.setdraftTitle$ = this.setdraftTitleSubject$.pipe(
      map((title: string) => (state: ImmutableAppState) => state.set('draftTitle', title))
    );

    this.setdraftBody$ = this.setdraftBodySubject$.pipe(
      map((title: string) => (state: ImmutableAppState) => state.set('draftBody', title))
    );

    this.appState$ = merge(
      this.addJoke$,
      this.removeJoke$,
      this.favoriteJoke$,
      this.unfavoriteJoke$,
      this.setdraftTitle$,
      this.setdraftBody$
    ).pipe(
      scan((state: AppState, changeFn: MapToState<AppState>) => changeFn(state), fromJS(this.initialState)),
      startWith(fromJS(this.initialState)),
      // tap((state) => console.log('state', JSON.stringify(state, null, 4)))
    );

    this.jokes$ = this.appState$.pipe(
      map(state => state.get('jokes').toJS()),
      tap(jokes => this.localstorageService.setJokes(jokes))
    );

    this.draftTitle$ = this.appState$.pipe(
      map(state => state.get('draftTitle'))
    );

    this.draftBody$ = this.appState$.pipe(
      map(state => state.get('draftBody'))
    );
  }

  addJoke(joke: Joke): void {
    this.addJokeSubject.next(joke);
  }

  removeJoke(joke: Joke): void {
    this.removeJokeSubject.next(joke);
  }

  favoriteJoke(joke: Joke): void {
    this.favoriteJokeSubject.next(joke);
  }

  unfavoriteJoke(joke: Joke): void {
    this.unfavoriteJokeSubject.next(joke);
  }

  setDraftTitle(title: string): void {
    this.setdraftTitleSubject.next(title);
    this.localstorageService.setDrafteTitle(title);
  }

  setDraftBody(body: string): void {
    this.setdraftBodySubject.next(body);
    this.localstorageService.setDrafteBody(body);
  }
}
