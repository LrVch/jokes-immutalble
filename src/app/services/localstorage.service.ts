import { Injectable } from '@angular/core';
import { Subject, fromEvent, Observable } from 'rxjs';
import { Joke } from '../models/joke';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  storage = window.localStorage;
  prefix = 'just-';
  data$: Observable<any>;

  constructor() {
    this.data$ = fromEvent(window, 'storage').pipe(
      map((event: any) => ({key: event.key, data: event.newValue})),
    );
  }

  setJokes(value: any) {
    this.storage.setItem(`${this.prefix}jokes`, JSON.stringify(value));
  }

  getJokes() {
    return JSON.parse(this.storage.getItem(`${this.prefix}jokes`));
  }

  clear() {
    this.storage.clear();
  }

  remove(key: string) {
    this.storage.removeItem(`${this.prefix}${key}`);
  }

  setDrafteTitle(value: string) {
    this.storage.setItem(`${this.prefix}jokes-title`, JSON.stringify(value));
  }

  getDrafteTitle() {
    return JSON.parse(this.storage.getItem(`${this.prefix}jokes-title`));
  }

  setDrafteBody(value: string) {
    this.storage.setItem(`${this.prefix}jokes-body`, JSON.stringify(value));
  }

  getDrafteBody() {
    return JSON.parse(this.storage.getItem(`${this.prefix}jokes-body`));
  }
}
