/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {A11yModule} from '@angular/cdk/a11y';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {CommonModule, CurrencyPipe, DecimalPipe} from "@angular/common";
import {ExportService} from "./core/services/common/export.service";
import {
    NgbActiveModal,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbPaginationModule,
    NgbTypeaheadModule
} from "@ng-bootstrap/ng-bootstrap";
import {ModalModule} from "ngx-bootstrap/modal";

/**
 * NgModule that includes all Material modules that are required to serve the demo-app.
 */
@NgModule({
    imports: [
        ModalModule.forRoot(),
        CommonModule,
    ],
    exports: [
        A11yModule,
        CdkStepperModule,
        CdkTableModule,
        CdkTreeModule,
        DragDropModule,
        CommonModule,
        NgbPaginationModule,
        NgbTypeaheadModule,
        NgbDropdownModule,
        NgbModalModule,
        NgbDatepickerModule,

    ],
    declarations: [],
    providers: [
        ExportService, CurrencyPipe, DecimalPipe, NgbActiveModal
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppBootstrapModule {
}
