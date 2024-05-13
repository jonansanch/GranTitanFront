import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../input/input.component';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/core/services/language.service';

@Component({
  selector: 'app-inputDate',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InputDateComponent extends InputComponent {

  constructor(protected translate: TranslateService,
              protected lang: LanguageService) {
      super(translate, lang);
  }
}
