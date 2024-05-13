import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../core/services/language.service";

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ToolbarComponent implements OnInit {

    @Output() createEvent = new EventEmitter<number>();
    @Output() filterEvent = new EventEmitter<number>();
    @Output() exportExcelEvent = new EventEmitter<number>();
    @Output() exportCsvEvent = new EventEmitter<number>();
    @Output() cleanEvent = new EventEmitter<number>();
    @Input() fieldShowDelete: string;
    @Input() renderCreate: boolean;
    @Input() renderFilter: boolean;
    @Input() renderExport: boolean;
    @Input() renderClean: boolean;
    

    ngAfterViewInit() {
    }

    constructor(protected translate: TranslateService,
                protected lang: LanguageService,) {
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngOnInit() {
        try {
            this.translate.setDefaultLang(this.lang.browserLanguage());
            this.renderCreate = false;
            this.renderFilter = true;
            this.renderExport;
            console.log(this.renderClean);
            this.renderClean = true;
        } catch (error) {
            console.error('Error message', error);
        }
    }

    create(element: any) {
        this.createEvent.emit(element);
    }

    filter(element: any) {
        this.filterEvent.emit(element);
    }

    exportToExcel(element: any) {
        this.exportExcelEvent.emit(element);
    }

    exportToCsv(element: any) {
        this.exportCsvEvent.emit(element);
    }

    clean(element: any){
        this.cleanEvent.emit(element);
    }
}
