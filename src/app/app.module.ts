import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {
  JokesComponent,
  JokesFormComponent,
  JokeComponent,
  BaseFormComponent
} from './components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FavoriteJokesPipe } from './pipes/favoriteJokes.pipe';

@NgModule({
  declarations: [
    AppComponent,
    JokesComponent,
    JokeComponent,
    JokesFormComponent,
    BaseFormComponent,
    FavoriteJokesPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
