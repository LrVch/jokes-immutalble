import { Observable, BehaviorSubject } from 'rxjs';
import { withLatestFrom, map, filter, tap, share } from 'rxjs/operators';

export const createSelector = <T>(
  state: Observable<T>,
  prevState: BehaviorSubject<T>,
  prop: string
) => {
  return state.pipe(
    withLatestFrom(prevState.asObservable()),
    map(([feature, pvState]) => ({ feature, pvState, prop: prop })),
    filter(actions => actions.feature[prop] !== actions.pvState[prop]),
    tap((actions) => {
      console.log(actions);
      prevState.next({ ...actions.pvState, [prop]: actions.feature[prop] });
    }),
    map(actions => actions.feature[prop]),
  );
};

export type MapToState<T> = (state: T) => T;
