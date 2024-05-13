import {Component, EventEmitter, Inject, Input, OnDestroy, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef,} from '@angular/material/dialog';
import {DialogData} from "./dialog.component";
import {PlantillaCrear} from 'src/app/core/models/app/plantilla-crear.model';
import {DialogComponent} from "../../common/dialog/dialog.component";
import {PlantillaDetalleCrear} from 'src/app/core/models/app/plantilla-detalle-crear.models';
import {PlantillaDetallePaginadorModel} from 'src/app/core/models/app/plantilla-detalle-paginador.model';
import {SessionService} from "../../../core/services/session/session.service";

@Component({
    selector: 'app-dialog-confirm-plantilla',
    templateUrl: './dialog-confirm-plantilla.component.html',
    styleUrls: ['./dialog-confirm-plantilla.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DialogConfirmPlantillaComponent {
    @Input() message: string;
    @Input() title: string;
    @Output() aceptarEvent = new EventEmitter<any>();
    @Output() cancelarEvent = new EventEmitter<any>();
    // 1. crear 2. actualizar 3. eliminar
    @Input() accion: number;
    model: PlantillaCrear = new PlantillaCrear();
    plantillaDetalleCrear: PlantillaDetalleCrear = new PlantillaDetalleCrear();
    @ViewChild(DialogComponent) public dialogRes: DialogComponent;
    estructura: any = false;
    filtro: PlantillaDetallePaginadorModel;
    dataParrafos: any = [];

    constructor(
        public dialog: MatDialog,
        public dialogo: MatDialogRef<DialogConfirmPlantillaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        protected sessionService: SessionService
    ) {
    }

    ngOnInit(): void {

    }

    openDialogConfirmPlantilla(message: string, title: string = "") {
        this.data.message = message;
        this.data.title = title;
        this.dialog.open(DialogConfirmPlantillaComponent, {
            data: this.data
        })
            .afterClosed()
            .subscribe((aceptar: boolean) => {
                if (aceptar) {
                    this.aceptarEvent.emit('');
                } else {
                    this.cancelarEvent.emit('');
                }
            });
    }

    confirm(message: string = "", title: string = "", $eventClose = null) {

        this.data.message = message;
        this.data.title = title;
        const dialog = this.dialog.open(DialogConfirmPlantillaComponent, {data: this.data});

        // Evento cuando cierra
        if ($eventClose != null) {
            dialog.afterClosed().subscribe(aceptar => {
                if (aceptar) {
                    $eventClose();
                }
            })
        }
    }

    close(element: any) {
        this.dialogo.close(false);
    }

    aceptar(element: any) {
        this.sessionService.setItem('cloneEstructura', this.estructura);
        this.dialogo.close(true);
    }

}
