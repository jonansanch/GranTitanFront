import {Component, ViewEncapsulation} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../../core/services/language.service";
import {InputComponent} from "../input/input.component";

@Component({
    selector: 'app-inputText',
    templateUrl: './input-text.component.html',
    styleUrls: ['./input-text.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InputTextComponent extends InputComponent {

    constructor(protected translate: TranslateService,
                protected lang: LanguageService) {
        super(translate, lang);
    }
}
