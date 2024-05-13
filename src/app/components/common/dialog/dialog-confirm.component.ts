import {Component, EventEmitter, Inject, Input, Output, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef,} from '@angular/material/dialog';
import {IdialogConfirmComponent} from "./idialog-confirm.component";
import {DialogData} from "./dialog.component";

@Component({
    selector: 'app-dialog-confirm',
    templateUrl: './dialog-confirm.component.html',
    styleUrls: ['./dialog-confirm.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DialogConfirmComponent implements IdialogConfirmComponent {
    @Input() message: string;
    @Input() title: string;
    @Output() aceptarEvent = new EventEmitter<any>();
    @Output() cancelarEvent = new EventEmitter<any>();
    // 1. crear 2. actualizar 3. eliminar
    @Input() accion: number;

    constructor(
        public dialog: MatDialog,
        public dialogo: MatDialogRef<DialogConfirmComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {
    }

    ngOnInit(): void {

    }

    openDialogConfirm(message: string, title: string = "") {
        this.data.message = message;
        this.data.title = title;
        this.dialog.open(DialogConfirmComponent, {
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

    confirm(message: string="", title: string="", $eventClose=null) {

        this.data.message = message;
        this.data.title = title;
        const dialog = this.dialog.open(DialogConfirmComponent, { data: this.data } );
        
        // Evento cuando cierra
        if($eventClose != null){
            dialog.afterClosed().subscribe(aceptar=>{
                if (aceptar) {
                    $eventClose();
                }                
            })            
        } 
    }

    aceptar(element: any) {
        this.dialogo.close(true)
    }

    close(element: any) {
        this.dialogo.close(false);
    }
}
