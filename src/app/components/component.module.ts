import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import 'hammerjs';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableComponent} from "./common/table/table.component";
import {AppMaterialModule} from "../app.material.module";
import {DialogComponent} from './common/dialog/dialog.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogConfirmComponent} from "./common/dialog/dialog-confirm.component";
import {SpinnerComponent} from "./common/spinner/spinner.component";
import {DataTableComponent} from "./common/data-table/data-table.component";
import {AppBootstrapModule} from "../app.bootstrap.module";
//import {CrudComponent} from "./crud/crud.component";
import {ModalComponent} from "./common/modal/modal.component";
import {ModalConfirmComponent} from "./common/modal/modal-confirm.component";
import {AlertComponent} from "./common/alert/alert.component";
import {ToolbarComponent} from "./common/button/toolbar.component";
import {TableDragComponent} from "./common/table-drag/table-drag.component";
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import {InputNumberComponent} from "./common/form/input-number/input-number.component";
import {InputTextComponent} from "./common/form/input-text/input-text.component";
import {InputComponent} from "./common/form/input/input.component";
import {FormComponent} from "./common/form/form.component";
import {InputTextAreaComponent} from "./common/form/input-text-area/input-text-area.component";
import {InputFileComponent} from "./common/form/input-file/input-file.component";
import {InputRadioComponent} from "./common/form/input-radio/input-radio.component";
import {InputSelectComponent} from "./common/form/input-select/input-select.component";
import {InputCurrencyComponent} from "./common/form/input-currency/input-currency.component";
import {InputDateComponent} from "./common/form/input-date/input-date.component";
//import {ModalProcesoInternoComponent} from "./common/modal/modal-proceso-interno.component";
registerLocaleData(es);

@NgModule({
    imports: [
        RouterModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialModule,
        AppBootstrapModule,
    ],
    declarations: [
        TableComponent,
        DialogComponent,
        DialogConfirmComponent,
        SpinnerComponent,
        ModalComponent,
        ModalConfirmComponent,
        DataTableComponent,        
        AlertComponent,
        ToolbarComponent,
        TableDragComponent,        
        FormComponent,
        InputComponent,
        InputTextComponent,
        InputNumberComponent,
        InputTextAreaComponent,
        InputSelectComponent,
        InputRadioComponent,
        InputFileComponent,
        InputCurrencyComponent,
        InputDateComponent,                
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    exports: [
        RouterModule,
        TableComponent,
        DialogComponent,
        DialogConfirmComponent,
        SpinnerComponent,
        ModalComponent,
        ModalConfirmComponent,
        DataTableComponent,        
        AlertComponent,
        ToolbarComponent,
        TableDragComponent,        
        FormComponent,
        InputComponent,
        InputTextComponent,
        InputNumberComponent,
        InputTextAreaComponent,
        InputSelectComponent,
        InputRadioComponent,
        InputFileComponent,
        InputCurrencyComponent,
        InputDateComponent,                
    ],
    providers: [
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue: {}},
        { provide: LOCALE_ID, useValue: 'es-CO' }
    ]
})
export class ComponentModule {
}
