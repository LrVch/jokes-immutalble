import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BaseFormComponent } from '../base-form/base-form.component';
import { FormBuilder, Validators } from '@angular/forms';
import { Joke } from 'src/app/models/joke';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-jokes-form',
  templateUrl: './jokes-form.component.html',
  styleUrls: ['./jokes-form.component.scss']
})
export class JokesFormComponent
  extends BaseFormComponent
  implements OnInit, OnDestroy {
  @Input('body') body = '';
  @Output() joke = new EventEmitter<Joke>();
  @Output() cached = new EventEmitter<Joke>();
  @Input('title') title = '';

  destroy$ = new Subject<any>();

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      body: ['', [Validators.required]]
    });

    this.titleControl.setValue(this.title);
    this.bodyControl.setValue(this.body);

    this.form.valueChanges.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.cached.emit(value);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit() {
    if (this.form.valid) {
      const value = this.form.value;
      const id = Math.random().toString(32).slice(2);
      const joke: Joke = {
        ...value,
        id,
        createdAt: Date.now()
      };
      this.joke.emit(joke);
      this.form.reset();
    } else {
      this.validateAllFormFields(this.form);
    }
  }

  get titleControl() {
    return this.form.get('title');
  }

  get requiredTitle() {
    return this.titleControl.touched && this.titleControl.hasError('required');
  }

  get invalidTitle() {
    return this.titleControl.touched && this.titleControl.invalid;
  }

  get bodyControl() {
    return this.form.get('body');
  }

  get invalidBody() {
    return this.bodyControl.touched && this.bodyControl.invalid;
  }

  get requiredBody() {
    return this.bodyControl.touched && this.bodyControl.hasError('required');
  }
}
