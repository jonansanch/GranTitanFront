import {Component, ViewEncapsulation} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../../core/services/language.service";
import {InputComponent} from "../input/input.component";

@Component({
    selector: 'app-inputFile',
    templateUrl: './input-file.component.html',
    styleUrls: ['./input-file.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InputFileComponent extends InputComponent {

    constructor(protected translate: TranslateService,
                protected lang: LanguageService) {
        super(translate, lang);
    }

    onChange(newValue: any) {
        // Perform actions based on the new value
        if (newValue.files.length > 0) {
            const file = newValue.files[0];
            this.controlName.setValue(file);
            return;
        }
        this.controlName.setValue(newValue.value);
    }
}
