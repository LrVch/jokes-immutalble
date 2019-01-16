import { Joke } from './joke';

export interface AppState {
    jokes: Joke[];
    draftTitle: string;
    draftBody: string;
}
