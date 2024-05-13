import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation
} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../core/services/language.service";
import {ExportService} from "../../../core/services/common/export.service";
import {ExcelJson} from "../../../core/models/interfaces/excel-json.interface";
import {DecimalPipe} from "@angular/common";
import {Menuitem} from "../../../core/models/component/menuitem";
import {IdataTableComponent} from "./idata-table.component";
import {JsonService} from "../../../core/services/common/json.service";
import {SessionService} from "../../../core/services/session/session.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-data-table',
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DataTableComponent implements OnInit, IdataTableComponent, AfterViewInit, OnDestroy {

    @Input() dataSource: any[];
    @Input() cols: Menuitem[];
    @Input() totalRecords: number;
    @Input() pageSize: number;
    @Input() currentPage: number;
    @Input() displayedColumns: string[];
    @Input() pageSizeOptions: number[];
    @Output() changePage = new EventEmitter<number>();
    @Output() changeSize = new EventEmitter<number>();
    @Output() addElement = new EventEmitter<any>();
    @Output() editElement = new EventEmitter<any>();
    @Output() deleteElement = new EventEmitter<any>();
    @Output() versionElement = new EventEmitter<any>();
    @Output() detailsElement = new EventEmitter<any>();
    @Input() renderTable: boolean;
    @Input() renderAdd: boolean;
    @Input() renderEditar: boolean;
    @Input() renderDelete: boolean;
    @Input() renderDetails: boolean;
    @Input() renderVersion: boolean;
    @Input() fieldShowEdit: string;
    @Input() fieldShowDelete: string;
    @Input() fieldShowVersion: string;

    private URL = '';
    public loading;
    accion: number;

    ngAfterViewInit() {
    }

    constructor(protected translate: TranslateService,
                protected lang: LanguageService,
                protected exportService: ExportService,
                protected decimalPipe: DecimalPipe,
                protected sessionService: SessionService,
                protected jsonService: JsonService) {

        this.cols = [];
        this.loading = false;
        this.totalRecords = 0;
        this.pageSize = 5;
        this.currentPage = 0;
        this.displayedColumns = [];
        this.pageSizeOptions = [5, 10, 20];
        this.URL = './assets/data/data.json';
        this.renderTable = true;
        this.renderAdd = true;
        this.renderEditar = true;
        this.renderDelete = true;
        this.renderVersion = true;
        this.renderDetails = true;
        this.fieldShowEdit = "";
        this.fieldShowDelete = "";
        this.fieldShowVersion = "";
        this.accion = 0;
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngOnInit() {
        try {
            this.translate.setDefaultLang(this.lang.browserLanguage());
            this.loading = true;
            this.pageSize = 5;
            this.currentPage = 1;
            this.pageSizeOptions = [5, 10, 20];
            this.renderTable = true;
        } catch (error) {
            console.error('Error message', error);
            this.loading = false;
        }
    }

    /**
     * Método que se encarga de capturar el cambio de página de la tabla
     * @param currentPage Evento disparado cuando ocurre un cambio en el paginado
     */
    changedPage(currentPage: number) {
        this.changePage.emit(currentPage);
    }

    /**
     * Método que se encarga de capturar el cambio de página de la tabla
     * @param pageSize Evento disparado cuando ocurre un cambio en el paginado
     */
    changedSize(pageSize: number) {
        this.changeSize.emit(pageSize);
    }

    /**
     * Método que se encarga de ADD el registro
     * @param element
     */
    add(element: any) {
        this.addElement.emit(element);
    }

    /**
     * Método que se encarga de editar el registro
     * @param element
     */
    edit(element: any) {
        this.editElement.emit(element);
    }

    /**
     * Método que se encarga en ver e ldetalle del registro
     * @param element
     */
    details(element: any) {
        this.detailsElement.emit(element);
    }

    /**
     * Método que se encarga de editar el registro
     * @param element
     */
    delete(element: any) {
        this.deleteElement.emit(element);
    }

    /**
     * header columns
     */
    addColumns() {
    }

    /**
     * Function prepares data to pass to export service to create excel from Table DOM reference
     *
     */
    exportToExcel(): void {
        try {
            let json: Array<ExcelJson> = [];
            const bd = {
                data: this.dataSource,
                header: this.getColumns()
            };
            json.push(bd)
            this.exportService.exportJsonToExcel(json, 'info-export');
        } catch (error) {
            console.error('Error message', error);
        }
    }


    /**
     * Funtion prepares data to pass to export service to create csv from Json
     *
     */
    exportToCsv(): void {
        try {
            this.exportService.exportToCsv(this.dataSource, 'info-export', this.getColumns(), '|');
        } catch (error) {
            console.error('Error message', error);
        }
    }


    private getColumns(): string[] {
        let colums: string[] = [];
        if (this.cols) {
            for (let col of this.cols) {
                colums.push(col.key);
            }
        }
        return colums;
    }


    formatCurrecy(val: string) {
        // 1. format the number (add commas)
        return this.decimalPipe.transform(parseInt(val), '1.0', 'en-US');
    }

    formatCurrecyNumber(val: number) {
        // 1. format the number (add commas)
        return this.decimalPipe.transform(val, '1.0', 'en-US');
    }

    getAllSample() {
        setTimeout(() => {
            this.loading = true;
            //dataSource imitation
            this.jsonService.getData(this.URL).then(data => {
                if (!data) {
                    this.loading = false;
                    return;
                }
                this.addColumns();
                this.displayedColumns = this.cols.map((col) => col.key);
                this.dataSource = data;
                this.sessionService.setItem("crudData", this.dataSource);
                this.totalRecords = this.dataSource.length;
                let crudData = this.sessionService.getItem("crudData");
                if (crudData) {
                    this.dataSource = crudData.slice(
                        0,
                        this.pageSize
                    );
                }
                this.loading = false;
            });
        }, 200);
    }

    countSample(event: any) {
        this.loading = true;
        let crudData = this.sessionService.getItem("crudData");
        if (crudData) {
            this.dataSource = crudData.slice(
                this.currentPage,
                this.pageSize
            );
        }
        this.loading = false;
    }

    refreshComponent(router: Router, refreshComponent: string, actualComponent: string) {
        router.navigateByUrl(refreshComponent, {skipLocationChange: true}).then(() => {
            router.navigate([actualComponent]).then(r => {
            });
        });
    }

    ngOnDestroy(): void {
        this.sessionService.removeItem('"crudData"');
    }
}
