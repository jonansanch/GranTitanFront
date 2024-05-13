import {Component, Input, ViewEncapsulation} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../../core/services/language.service";
import {InputComponent} from "../input/input.component";

@Component({
    selector: 'app-inputTextArea',
    templateUrl: './input-text-area.component.html',
    styleUrls: ['./input-text-area.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InputTextAreaComponent extends InputComponent {

    @Input() rows: number;
    @Input() cols: number;

    constructor(protected translate: TranslateService,
                protected lang: LanguageService) {
        super(translate, lang);
        this.rows = 5;
        this.cols = 100;
    }
}
