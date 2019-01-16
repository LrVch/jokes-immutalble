import { Injectable } from '@angular/core';
import { Joke } from '../models/joke';
import { Observable, Subject, merge, BehaviorSubject } from 'rxjs';
import { AppState } from '../models/appState';
import { map, scan, startWith, pluck, tap } from 'rxjs/operators';
import { MapToState } from '../utils';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private appState$: Observable<AppState>;
  private initialState: AppState;

  prevState;

  private previousStateSubject = new BehaviorSubject<AppState>({} as AppState);

  private addJokeSubject = new Subject<Joke>();
  private addJokeSubject$ = this.addJokeSubject.asObservable();
  private addJoke$: Observable<MapToState<AppState>>;

  private removeJokeSubject = new Subject<Joke>();
  private removeJokeSubject$ = this.removeJokeSubject.asObservable();
  private removeJoke$: Observable<MapToState<AppState>>;

  private favoriteJokeSubject = new Subject<Joke>();
  private favoriteJokeSubject$ = this.favoriteJokeSubject.asObservable();
  private favoriteJoke$: Observable<MapToState<AppState>>;

  private unfavoriteJokeSubject = new Subject<Joke>();
  private unfavoriteJokeSubject$ = this.unfavoriteJokeSubject.asObservable();
  private unfavoriteJoke$: Observable<MapToState<AppState>>;

  private setdraftTitleSubject = new Subject<string>();
  private setdraftTitleSubject$ = this.setdraftTitleSubject.asObservable();
  private setdraftTitle$: Observable<MapToState<AppState>>;

  private setdraftBodySubject = new Subject<string>();
  private setdraftBodySubject$ = this.setdraftBodySubject.asObservable();
  private setdraftBody$: Observable<MapToState<AppState>>;

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
      map((joke: Joke) => (state: AppState) => ({
        ...state,
        jokes: [...state.jokes, joke]
      })),
    );

    this.removeJoke$ = this.removeJokeSubject$.pipe(
      map((joke: Joke) => (state: AppState) => ({
        ...state,
        jokes: state.jokes.filter(j => j.id !== joke.id)
      }))
    );

    this.favoriteJoke$ = this.favoriteJokeSubject$.pipe(
      map((joke: Joke) => (state: AppState) => ({
        ...state,
        jokes: state.jokes.map(j => j.id === joke.id ? { ...j, favorited: true } : j)
      }))
    );

    this.unfavoriteJoke$ = this.unfavoriteJokeSubject$.pipe(
      map((joke: Joke) => (state: AppState) => ({
        ...state,
        jokes: state.jokes.map(j => j.id !== joke.id ? j : { ...j, favorited: false })
      }))
    );

    this.setdraftTitle$ = this.setdraftTitleSubject$.pipe(
      map((title: string) => (state: AppState) => ({
        ...state,
        draftTitle: title
      })),
    );

    this.setdraftBody$ = this.setdraftBodySubject$.pipe(
      map((body: string) => (state: AppState) => ({
        ...state,
        draftBody: body
      }))
    );

    this.appState$ = merge(
      this.addJoke$,
      this.removeJoke$,
      this.favoriteJoke$,
      this.unfavoriteJoke$,
      this.setdraftTitle$,
      this.setdraftBody$
    ).pipe(
      scan((state: AppState, changeFn: MapToState<AppState>) => changeFn(state), this.initialState),
      startWith(this.initialState),
      // tap((state) => console.log('state', JSON.stringify(state, null, 4)))
    );

    this.jokes$ = this.appState$.pipe(
      map(state => state.jokes),
      tap(jokes => this.localstorageService.setJokes(jokes))
    );

    this.draftTitle$ = this.appState$.pipe(
      map(state => state.draftTitle)
    );

    this.draftBody$ = this.appState$.pipe(
      map(state => state.draftBody),
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
