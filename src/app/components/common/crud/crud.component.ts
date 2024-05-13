import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {PageEvent} from "@angular/material/paginator";
import {TableComponent} from "../table/table.component";
import {ItableComponent} from "../table/itable.component";
import {JsonService} from "../../../core/services/common/json.service";
import {LanguageService} from "../../../core/services/language.service";
import {SessionService} from "../../../core/services/session/session.service";
import {ExportService} from "../../../core/services/common/export.service";
import {DecimalPipe} from "@angular/common";

@Component({
    template: '',
    selector: ''
})
export class CrudComponent extends TableComponent implements OnInit, AfterViewInit, OnDestroy, ItableComponent {

    @Output() filtrarEvent = new EventEmitter();
    @Output() guardarEvent = new EventEmitter();
    @Output() editarEvent = new EventEmitter();
    @Output() eliminarEvent = new EventEmitter();
    @Output() detalleEvent = new EventEmitter();
    @Output() clonarEvent = new EventEmitter();

    // paginacion para la consulta a BD
    filtro: any;

    constructor(protected translate: TranslateService,
                protected lang: LanguageService,
                protected exportService: ExportService,
                protected decimalPipe: DecimalPipe,
                protected sessionService: SessionService,
                protected jsonService: JsonService
    ) {
        super(translate, lang, exportService, decimalPipe, sessionService, jsonService);
    }

    ngOnInit(): void {
        this.translate.setDefaultLang(this.lang.browserLanguage());
        super.ngOnInit();
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
    }

    ngOnDestroy(): void {
    }

    /**
     * Método que se encarga de capturar el cambio de página de la tabla
     * @param pageEvent Evento disparado cuando ocurre un cambio en el paginado
     */
    changedPage(pageEvent: PageEvent) {
        try {
            this.loading = true;
            this.pageSize = pageEvent.pageSize;
            this.currentPage = pageEvent.pageIndex;
            if (this.paginator) {
                this.paginator.pageIndex = this.currentPage;
            }
            this.filtro.paginaActual = this.currentPage + 1;
            this.filtro.registrosPorPagina = this.pageSize;
            this.filtrar();

            this.loading = false;
        } catch (error) {
            console.error('Error message', error);
            this.loading = false;
        }
    }

    /**
     * metodo que se encarga de ejecutar los metodos segun corresponda la accion
     * @param element
     */
    aceptar(element: string) {
        try {
            switch (this.accion) {
                case 1: {
                    this.Guardar();
                    break;
                }
                case 2: {
                    this.Editar();
                    break;
                }
                case 3: {
                    this.Eliminar();
                    break;
                }
                case 4: {
                    this.VerDetalle();
                    break;
                }
                case 5: {
                    this.Clonar();
                    break;
                }
                default: {
                    throw new Error('error type option');
                }
            }
        } catch (error) {
            console.error('Error message', error);
            this.loading = false;
        }
    }

    protected filtrar() {
        this.filtrarEvent.emit();
    }

    protected Guardar() {
        this.guardarEvent.emit();
    }

    protected Editar() {
        this.editarEvent.emit();
    }

    protected VerDetalle() {
        this.detalleEvent.emit();
    }

    protected Eliminar() {
        this.eliminarEvent.emit();
    }

    protected Clonar() {
        this.clonarEvent.emit();
    }

}
