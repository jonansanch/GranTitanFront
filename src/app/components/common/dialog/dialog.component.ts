import {Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent, MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { Router } from '@angular/router';

export interface DialogData {
    title: string;
    message: string;
    route: string;
}  

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DialogComponent implements OnInit {
    @Input() message: string;
    @Input() title: string;
    constructor(        
        public dialog: MatDialog,
        public dialogo: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private router: Router
    ) {}

    ngOnInit(): void {        
    }
    
    // Muestra el dialog con sus mensajes y cuando se pulsa Ok dispara el evento
    Generic(content: string, title: string = "", $eventClose=null) {
        this.data.message = content;
        this.data.title = title;
        const dialog = this.dialog.open(DialogComponent, { data: this.data } );
        
        // Evento cuando cierra
        if($eventClose != null){
            dialog.afterClosed().subscribe(r=>{
                $eventClose();
            })            
        }   
    }

    Ok(content: string="", title: string = "", $eventClose=null) {        
        content = content =="" ? "El proceso ha sido realizado satisfactoriamente" : content;
        title = title =="" ? "Mensaje" : title;
        this.Generic(content, title, $eventClose);
    }

    Fail(content: string="", title: string = "", $eventClose=null) {
        content = content =="" ? "Ha ocurrido un error al registrar la información" : content;
        title = title =="" ? "Error" : title;
        this.Generic(content, title, $eventClose);
    }

    openDialog(message: string, title: string = "", route: string = "") {
        this.data.message = message;
        this.data.title = title;
        this.data.route = route;
        this.dialog.open(DialogComponent, {
            data: this.data
          }
        );          
    }

    close(element: any, route: string = "") {
        this.dialogo.close(false);
        if (route) {
            this.router.navigate([route]);
        }
    }
}
