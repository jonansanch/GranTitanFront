import {Component, Input, ViewEncapsulation} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../../core/services/language.service";
import {InputComponent} from "../input/input.component";
import {DecimalPipe, getCurrencySymbol} from '@angular/common';

@Component({
    selector: 'app-inputCurrency',
    templateUrl: './input-currency.component.html',
    styleUrls: ['./input-currency.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InputCurrencyComponent extends InputComponent {

    @Input() min: number;

    constructor(protected translate: TranslateService,
                protected lang: LanguageService,
                private decimalPipe: DecimalPipe,) {
        super(translate, lang);
        this.min = 1;
    }

    onChange(event: any) {
        // Get the new input value
        let newValue = event.target.value;
        if (!newValue) {
            return;
        }
        this.value = this.formatCurrecyNumber(newValue);
        // Perform actions based on the new value
        this.controlName.setValue(newValue);
    }

    private formatCurrecyNumber(val: number): string {
        // 1. format the number (add commas)
        return getCurrencySymbol('COP', 'narrow') + this.decimalPipe.transform(val, '1.2-2');
    }

    onInput(event: any) {
        const input = event.target.value;
        const numericValue = input.replace(/\D/g, ''); // Elimina caracteres no numéricos
        event.target.value = numericValue; // Actualiza el valor del campo con el valor numérico
    }
}
