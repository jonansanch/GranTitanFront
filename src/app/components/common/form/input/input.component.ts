import {AfterViewInit, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../../core/services/language.service";

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InputComponent implements OnInit, AfterViewInit {

    @Input() label: string;
    @Input() value: any;
    @Input() formGroup: FormGroup;

    // validators
    @Input() required: boolean;
    @Input() formControlName: string;
    @Input() disabled: boolean;
    submitted: boolean;

    constructor(protected translate: TranslateService,
                protected lang: LanguageService) {
        this.required = true;
        this.submitted = false;
        this.disabled = false;
    }

    ngOnInit() {
        this.translate.setDefaultLang(this.lang.browserLanguage());
        this.formGroup.addControl(this.formControlName, new FormControl());
        this.addValidation();
    }

    get controlName(): AbstractControl {
        return this.formGroup.controls[this.formControlName];
    }

    addValidation() {
        if (this.required) {
            this.controlName.setValidators(Validators.required);
        }
        if (this.disabled) {
            this.controlName.disable();
        }
    }

    isValid() {
        if(!this.required) {
            return true;
        }
        return this.controlName?.value;
    }

    ngAfterViewInit(): void {

    }

    /**
     * i18n translate angular
     * @param cadena
     */
    traducir(cadena) {
        return this.translate.instant(cadena);
    }

    onChange(event: any) {
            // Get the new input value
            const newValue = event.target.value;
            // Perform actions based on the new value
            this.controlName.setValue(newValue);
    }
}
