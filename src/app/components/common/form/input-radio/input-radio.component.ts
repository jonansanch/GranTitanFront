import {Component, ViewEncapsulation} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../../core/services/language.service";
import {InputComponent} from "../input/input.component";

@Component({
    selector: 'app-inputRadio',
    templateUrl: './input-radio.component.html',
    styleUrls: ['./input-radio.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InputRadioComponent extends InputComponent {

    constructor(protected translate: TranslateService,
                protected lang: LanguageService) {
        super(translate, lang);
    }

    ngOnInit() {
        super.ngOnInit();
        this.controlName.setValue(false);
    }

    onChange(newValue: any) {
        // Perform actions based on the new value
        this.controlName.setValue(newValue.target.checked);
    }
}
