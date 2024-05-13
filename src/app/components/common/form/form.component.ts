import {AfterViewInit, Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertComponent} from "../alert/alert.component";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../core/services/language.service";
import {formatDate} from "@angular/common";
import {Enums} from "../enums";
import {SpinnerComponent} from "../spinner/spinner.component";

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    encapsulation: ViewEncapsulation.None
})
export class FormComponent extends AlertComponent {

    @ViewChild(SpinnerComponent) public spinner: SpinnerComponent;

    // Definición de variable de envío:
    submitted: boolean = false;
    formGroup: FormGroup;

    constructor(protected translate: TranslateService,
                protected lang: LanguageService,
                protected formBuilder: FormBuilder) {
        super(translate,lang);
        this.formGroup = this.formBuilder.group({});
     }

    ngOnInit() {
        this.translate.setDefaultLang(this.lang.browserLanguage());
    }

    getDateAlias(mesActual: Date = new Date()) : string {
        let mes = Enums.MESES[mesActual.getMonth()];
        let anyo = mesActual.getFullYear();
        let dia = mesActual.getDate();
        return anyo+'-'+mes+'-'+dia;
    }

    getAlias(model: any) {
        let date = '';
        let excepcional = model.esExcepcional ? 'excepcional' : '';
        let numExcepcional = model.esExcepcional && model.numeroExcepcional ? model.numeroExcepcional.toString() : '';
        excepcional = excepcional ? '-' + excepcional : '';
        numExcepcional = numExcepcional ? '-' + numExcepcional : '';
        if(model.idLiquidacion === 0 || !model.alias) {
             date = this.getDateAlias();
        }
        return (date + excepcional + numExcepcional);
    }

    getRegexAlias(alias: string, regex: string = '\\d{4}-\\w+-\\d') {
        alias = alias.match(regex) ? alias.match(regex)[0] : alias;
        return alias;
    }
}
