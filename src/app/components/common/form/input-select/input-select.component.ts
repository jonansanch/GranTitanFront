import {Component, Input, ViewEncapsulation} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../../core/services/language.service";
import {InputComponent} from "../input/input.component";

@Component({
    selector: 'app-inputSelect',
    templateUrl: './input-select.component.html',
    styleUrls: ['./input-select.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InputSelectComponent extends InputComponent {

    @Input() items: any[];
    @Input() propertyId: string;
    @Input() propertyValue: string;


    constructor(protected translate: TranslateService,
                protected lang: LanguageService) {
        super(translate, lang);
    }
}
