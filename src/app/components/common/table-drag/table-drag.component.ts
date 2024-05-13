import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {TableComponent} from "../table/table.component";
import {JsonService} from "../../../core/services/common/json.service";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../core/services/language.service";
import {SessionService} from "../../../core/services/session/session.service";
import {ExportService} from "../../../core/services/common/export.service";
import {DecimalPipe} from "@angular/common";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
    selector: 'app-table-drag',
    templateUrl: './table-drag.component.html',
    styleUrls: ['./table-drag.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TableDragComponent extends TableComponent {

    @Output() dropElement = new EventEmitter<CdkDragDrop<any[]>>();
    @Input() data: any[];

    constructor(
        protected jsonService: JsonService,
        protected translate: TranslateService,
        protected lang: LanguageService,
        protected sessionService: SessionService,
        protected exportService: ExportService,
        protected decimalPipe: DecimalPipe,
    ) {
        super(translate, lang, exportService, decimalPipe, sessionService, jsonService);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    drop(event: CdkDragDrop<any[]>) {
        // Return the drag container to disabled.
        moveItemInArray(this.data, event.previousIndex, event.currentIndex);
        this.dropElement.emit(event);
    }
}
