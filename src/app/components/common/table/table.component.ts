import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {LanguageService} from "../../../core/services/language.service";
import {ExportService} from "../../../core/services/common/export.service";
import {ExcelJson} from "../../../core/models/interfaces/excel-json.interface";
import {DecimalPipe, getCurrencySymbol} from "@angular/common";
import {Menuitem} from "../../../core/models/component/menuitem";
import {ItableComponent} from "./itable.component";
import {JsonService} from "../../../core/services/common/json.service";
import {SessionService} from "../../../core/services/session/session.service";
import {Router} from "@angular/router";
import {AlertComponent} from "../alert/alert.component";
import {MatSort} from "@angular/material/sort";
import {catchError, lastValueFrom} from "rxjs";
import {SpinnerComponent} from "../spinner/spinner.component";

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TableComponent extends AlertComponent implements OnInit, ItableComponent {

    @Input() dataSource: MatTableDataSource<any>;
    @Input() cols: Menuitem[];
    @Input() totalRecords: number;
    @Input() pageSize: number;
    @Input() currentPage: number;
    @Input() displayedColumns: string[];
    @Input() pageSizeOptions: number[];
    @Output() changePage = new EventEmitter<PageEvent>();
    @Output() addElement = new EventEmitter<any>();
    @Output() editElement = new EventEmitter<any>();
    @Output() deleteElement = new EventEmitter<any>();
    @Output() versionElement = new EventEmitter<any>();
    @Output() detailsElement = new EventEmitter<any>();
    @Output() cloneElement = new EventEmitter<any>();
    @Input() renderTable: boolean;
    @Input() renderAdd: boolean;
    @Input() renderEditar: boolean;
    @Input() renderDelete: boolean;
    @Input() renderVersion: boolean;
    @Input() renderDetails: boolean;
    @Input() renderExport: boolean;
    @Input() renderClone: boolean;
    @Input() renderCreate: boolean;
    @Input() renderFilter: boolean;

    // permite exportar los datos padre del detalle
    @Input() colsMaster: Menuitem[];

    //@Input() fieldShowEdit: string;
    //@Input() fieldShowDelete: string;

    @Input() fieldDisabledEdit: string;
    @Input() fieldDisabledDelete: string;

    @Input() addTitle: string;
    @Input() deleteTitle: string;
    @Input() addIcon: string;
    @Input() deleteIcon: string;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(SpinnerComponent) public spinner: SpinnerComponent;

    public URL = '';
    public loading;

    ngAfterViewInit() {
        try {
            this.dataSource.paginator = this.paginator;
            if (this.sort != null) {
                this.sort.disableClear = true;
                this.dataSource.sort = this.sort;
            }
        } catch (e) {
            console.error(e.message);
        }
    }

    constructor(protected translate: TranslateService,
                protected lang: LanguageService,
                protected exportService: ExportService,
                protected decimalPipe: DecimalPipe,
                protected sessionService: SessionService,
                protected jsonService: JsonService) {
        super(translate, lang);

        this.dataSource = new MatTableDataSource();
        this.cols = [];
        this.loading = false;
        this.totalRecords = 0;
        this.pageSize = 5;
        this.currentPage = 0;
        this.displayedColumns = [];
        this.pageSizeOptions;
        this.dataSource.paginator = this.paginator;
        this.URL = './assets/data/data.json';
        this.renderTable = true;
        this.renderAdd = true;
        this.renderEditar = true;
        this.renderDelete = true;
        this.renderDetails = true;
        this.renderExport = false;
        this.renderClone = false;
        this.renderVersion = false;
        // this.fieldShowEdit = "";
        // this.fieldShowDelete = "";
        this.fieldDisabledEdit = "";
        this.fieldDisabledDelete = "";
        this.renderCreate = false;
        this.renderFilter = true;
        this.colsMaster = [];
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngOnInit() {
        try {
            this.translate.setDefaultLang(this.lang.browserLanguage());
            this.loading = true;
            this.pageSize = 5;
            this.currentPage = 0;
            this.pageSizeOptions = [5, 10, 20, 30, 40, 50];
            this.renderTable = true;
            //this.count();
            //this.getAllSample();
        } catch (error) {
            console.error('Error message', error.message);
            this.loading = false;
        }
    }

    /**
     * Método que se encarga de capturar el cambio de página de la tabla
     * @param pageEvent Evento disparado cuando ocurre un cambio en el paginado
     */
    changedPage(pageEvent: PageEvent) {
        this.changePage.emit(pageEvent);
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
     * Método que se encarga de versionar el registro
     * @param element
     */
    version(element: any) {
        this.versionElement.emit(element);
    }

    /**
     * Método que se encarga de clonar el registro
     * @param element
     */
    clone(element: any) {
        this.cloneElement.emit(element);
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
                data: this.getData(this.dataSource.data),
                header: this.getColumns()
            };
            json.push(bd)
            this.exportService.exportJsonToExcel(json, 'info-export-excel');
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
            this.exportService.exportToCsv(this.getData(this.dataSource.data), 'info-export-csv', this.getColumns(), '|');
        } catch (error) {
            console.error('Error message', error);
        }
    }


    private getColumns(): string[] {
        let colums: string[] = [];
        let cols = [...this.colsMaster, ...this.cols];
        if (cols) {
            for (let col of cols) {
                if (col.tooltip && col.key !== 'operations') {
                    colums.push(col.tooltip);
                } else if (!col.tooltip && col.label && col.key !== 'operations') {
                    colums.push(col.label);
                }
            }
        }
        return [...new Set(colums)];
        ;
    }


    formatCurrecy(val: string) {
        // 1. format the number (add commas)
        return getCurrencySymbol('COP', 'narrow') + this.decimalPipe.transform(parseInt(val), '1.2-2');
    }

    formatCurrecyNumber(val: number) {
        // 1. format the number (add commas)
        return getCurrencySymbol('COP', 'narrow') + this.decimalPipe.transform(val, '1.2-2');
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
                this.dataSource.data = data;
                this.dataSource.paginator = (this.paginator);
                this.sessionService.setItem("crudData", this.dataSource.data);
                //this.totalRecords = this.dataSource.data.length;
                this.loading = false;
            });
        }, 1000);
    }

    refreshComponent(router: Router, refreshComponent: string, actualComponent: string) {
        router.navigateByUrl(refreshComponent, {skipLocationChange: true}).then(() => {
            router.navigate([actualComponent]).then(r => {
            });
        });
    }

    /**
     * i18n translate angular
     * @param cadena
     */
    traducir(cadena) {
        return this.translate.instant(cadena);
    }

    private getData(dataSource: any[]): any[] {
        let data: string[] = [];
        if (!this.cols) {
            return [];
        }
        if (!dataSource) {
            return [];
        }
        let auditoria: Menuitem[] = [];
        auditoria.push({key: "fechaRegistro", type: "date", label: "", tooltip: "Fecha registro"});
        auditoria.push({key: "usuarioRegistro", type: "text", label: "", tooltip: "Usuario registro"});
        auditoria.push({key: "fechaModifico", type: "date", label: "", tooltip: "Fecha modificó"});
        auditoria.push({key: "usuarioModifico", type: "text", label: "", tooltip: "Usuario modificó"});
        let colums = [...this.colsMaster, ...this.cols, ...auditoria];
        colums = [...new Set(colums)];
        colums = this.filterCols(colums);

        for (let element of dataSource) {
            let jsonStr = '{DATA}';
            let jsonDataStr = '';
            for (let col of colums) {
                let dataColumn = element[col.key];
                if (col.type == 'number') {
                    dataColumn = this.formatNumber(dataColumn);
                }
                if (col.type == 'date') {
                    dataColumn = this.formatDate(dataColumn);
                }
                if (col.type == 'currency') {
                    dataColumn = this.formatCurrecy(dataColumn);
                }
                /*if (dataColumn == false) {
                    dataColumn = 'false';
                }*/
                if (dataColumn && col.tooltip) {
                    jsonDataStr += '"' + col.tooltip + '"' + ':"' + dataColumn + '",';
                } else if (dataColumn && !col.tooltip) {
                    jsonDataStr += '"' + col.label + '"' + ':"' + dataColumn + '",';
                }
            }
            jsonDataStr = jsonDataStr.split("\n").join("")
            jsonDataStr = jsonDataStr.trimEnd();
            jsonStr = jsonStr.replace('DATA', jsonDataStr);
            jsonStr = jsonStr.replace(',}', '}');
            const json = this.safeJSONParse(jsonStr);
            json ? data.push(json) : null;
        }
        return data;
    }

    setDisabled(field, value) {
        if (field != "" && field != null) {
            if (value == true || value == 1 || value == "true") {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }

    /**
     * Function prepares data to pass to export service to create excel from Table DOM reference
     *
     */
    async exportAllToExcel(service: any, filtro: any) {
        try {
            filtro.registrosPorPagina = this.totalRecords;
            let dataSource: [] = await this.getDataSource(service, filtro);
            let json: Array<ExcelJson> = [];
            const bd = {
                data: this.getData(dataSource),
                header: this.getColumns()
            };
            json.push(bd)
            this.exportService.exportJsonToExcel(json, 'info-total-export-excel');
            this.spinner.hide();
            console.log("json export Excel", json);
        } catch (error) {
            console.error('Error message', error);
            this.Fail('No hay datos para exportar.');
            this.spinner.hide();
        }
    }

    /**
     * Function prepares data to pass to export service to create excel from Table DOM reference
     *
     */
    async ExportToExcelArr(arr: any, header: any, nombre = "") {
        try {
            this.spinner.show();
            let json: Array<ExcelJson> = [];
            const bd = {
                data: arr,
                header: header
            };
            json.push(bd)
            console.log("json export Excel", json);
            nombre = nombre == "" ? `Export-Excel_${nombre}_${this.generarNombre()}` : nombre;
            this.exportService.exportJsonToExcel(json, nombre);
            this.spinner.hide();

        } catch (error) {
            console.error('Error message', error);
            this.Fail('No hay datos para exportar.');
            this.spinner.hide();
        }
    }

    /**
     * Funtion prepares data to pass to export service to create csv from Json
     *
     */
    async exportToCsvArr(arr: any, header: any, nombre = "") {
        try {
            this.exportService.exportToCsv(arr, nombre, header, '|');
            this.spinner.hide();
        } catch (error) {
            console.error('Error message', error);
            this.Fail('No hay datos para exportar.');
            this.spinner.hide();
        }
    }

    generarNombre() {
        // Obtener la fecha actual
        var fecha = new Date();

        // Obtener los componentes de la fecha
        var año = fecha.getFullYear();
        var mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Se agrega 1 al mes porque los meses van de 0 a 11
        var dia = ('0' + fecha.getDate()).slice(-2);
        var horas = ('0' + fecha.getHours()).slice(-2);
        var minutos = ('0' + fecha.getMinutes()).slice(-2);
        var segundos = ('0' + fecha.getSeconds()).slice(-2);

        // Formatear la fecha en el formato deseado
        var textoFecha = año + mes + dia + ' ' + horas + ':' + minutos + ':' + segundos;

        // Mostrar el resultado
        console.log(textoFecha);
        return textoFecha;
    }

    /**
     * Funtion prepares data to pass to export service to create csv from Json
     *
     */
    async exportAllToCsv(service: any, filtro: any) {
        try {
            filtro.registrosPorPagina = this.totalRecords;
            let dataSource: [] = await this.getDataSource(service, filtro);
            this.exportService.exportToCsv(this.getData(dataSource), 'info-total-export-csv', this.getColumns(), '|');
            this.spinner.hide();
        } catch (error) {
            console.error('Error message', error);
            this.Fail('No hay datos para exportar.');
            this.spinner.hide();
        }
    }

    /**
     * get dataSource generic
     * @param service
     * @param filtro
     */
    private async getDataSource(service: any, filtro: any) {
        this.spinner.show();
        let data: any = await lastValueFrom(service.getPagination(filtro).pipe(
            catchError(error => {
                this.dataSource.data = [];
                this.renderTable = false;
                return error;
            })
        ));
        if (!data || !data.resultado) {
            this.dataSource.data = [];
            this.renderTable = false;
            this.spinner.hide();
            throw new Error('No se encontraron datos');
        }
        if (this.paginator) {
            this.paginator.length = data.totalRegistros;
        }
        let paginationDetails = this.sessionService.getItem("paginationDetails");
        this.totalRecords = data.totalRegistros;
        !paginationDetails ? this.sessionService.setItem("totalRecords", this.totalRecords) : null;
        return data.resultado;
    }

    /**
     * get pagination service
     * @param service
     * @param filtro
     */
    async getPagination(service: any, filtro: any) {
        this.sessionService.setItem("paginationDetails", false);
        let cancelPage: boolean = this.sessionService.getItem("cancelPage");
        if (cancelPage) {
            this.sessionService.setItem("cancelPage", false);
            this.dataSource.data = this.sessionService.getItem("dataSource");
            this.totalRecords = this.sessionService.getItem("totalRecords");
            this.displayedColumns = this.cols.map((col) => col.key);
            if (this.paginator) {
                this.paginator.length = this.totalRecords;
                this.dataSource.paginator = (this.paginator);
            }
            this.renderTable = true;
            this.spinner.hide();
            return;
        }
        this.dataSource.data = await this.getDataSource(service, filtro);
        this.displayedColumns = this.cols.map((col) => col.key);
        this.dataSource.paginator = (this.paginator);
        this.sessionService.setItem("dataSource", this.dataSource.data);
        this.sessionService.setItem("displayedColumns", this.displayedColumns);
        this.sessionService.setItem("cancelPage", false);
        this.loading = false;
        this.renderTable = true;
        this.spinner.hide();
    }

    /**
     * get pagination details service
     * @param service
     * @param filtro
     */
    async getPaginationDetails(service: any, filtro: any) {
        this.sessionService.setItem("paginationDetails", true);
        this.sessionService.setItem("cancelPage", false);
        this.dataSource.data = await this.getDataSource(service, filtro);
        this.sessionService.setItem("dataSourceDet", this.dataSource.data);
        this.displayedColumns = this.cols.map((col) => col.key);
        this.dataSource.paginator = (this.paginator);
        this.loading = false;
        this.renderTable = true;
        this.spinner.hide();
    }

    /**
     * cancel page create, update and details
     * validate get pagination event invoke
     * @param url
     * @param router
     */
    cancelPage(url: string, router: Router) {
        router.navigateByUrl(url).then(r => {
            this.sessionService.setItem("cancelPage", true);
        });
    }

    /**
     * error method
     * @param error
     */
    errorPagination(error) {
        this.renderTable = false;
        this.renderCreate = true;
        this.spinner ? this.spinner.hide() : null;
        console.error('Error message', error.message);
        this.loading = false;
    }

    /**
     * error method
     * @param error
     */
    error(error) {
        this.spinner.hide();
        console.error('Error message', error.message);
        this.Fail(error.message)
    }

    /**
     * add columns master of details
     */
    addColumnsMaster() {
    }

    /**
     * parse json escape string format
     * @param jsonString
     */
    safeJSONParse(jsonString) {
        let unescapedJSON = '';
        try {
            // Step 1: Unescape JSON strings to handle double-escaped characters
            unescapedJSON = jsonString.replace(/\\./g, (match) => {
                switch (match) {
                    case '\\"':
                        return '"';
                    case '\\n':
                        return '\n';
                    case '\\t':
                        return '\t';
                    // Add more escape sequences as needed
                    default:
                        return match[1]; // Remove the backslash
                }
            });

            // Step 2: Parse the unescaped JSON
            const parsedData = JSON.parse(unescapedJSON);

            return parsedData;
        } catch (error) {
            console.error('Error parsing JSON:', error);
            console.error('unescapedJSON:', unescapedJSON);
            this.Fail(error);
        }
    }

    /**
     * format date DD/MM/YYYY
     * @param date
     */
    formatDate(date: string) {
        try {
            if (!date) {
                return '';
            }
            return new Date(date).toLocaleDateString('en-GB');
        } catch (error) {
            console.error('Error format DATE:', error);
            this.Fail(error);
        }
    }

    formatNumber(val) {
        // 1. format the number (add .)
        return this.decimalPipe.transform(parseInt(val));
    }

    /**
     * valida si los campos de auditoria ya se encuentran en las columnas de la tabla
     * para no repetir campos
     * @param cols
     */
    filterCols(cols: Menuitem[]) {
        let uniqueCols = [];
        cols.forEach(function (item) {
            if (!uniqueCols.includes(item.key)) {
                uniqueCols.push(item);
            }
        });
        return uniqueCols;
    }

    async clearFilter() {
    }
}
