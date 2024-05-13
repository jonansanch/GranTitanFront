import {Component, Input, ViewEncapsulation} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../../core/services/language.service";
import {InputComponent} from "../input/input.component";

@Component({
    selector: 'app-inputNumber',
    templateUrl: './input-number.component.html',
    styleUrls: ['./input-number.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InputNumberComponent extends InputComponent {

    @Input() min: number;
    @Input() max: number;

    constructor(protected translate: TranslateService,
                protected lang: LanguageService) {
        super(translate, lang);
        this.min = 1;
        this.max = 100;
    }
}
