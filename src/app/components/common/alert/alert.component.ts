import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../core/services/language.service";
import Swal from 'sweetalert2';

export enum TYPE {
    ERROR = 'error',
    SUCCESS = 'success',
    WARNING = 'warning',
    INFO = 'info',
    QUESTION = 'question'
}

export class ModelData {
    tittle: string;
    message: string;
    route: string;
}

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

    @Output() acceptEvent = new EventEmitter<any>();
    @Output() cancelEvent = new EventEmitter<any>();
    // 1. crear 2. actualizar 3. eliminar
    @Input() accion: number;
    @Input() msg: ModelData;
    closeResult = '';

    constructor(protected translate: TranslateService,
                protected lang: LanguageService,) {
        this.msg = new ModelData();
    }

    ngOnInit() {
        this.translate.setDefaultLang(this.lang.browserLanguage());
    }

    openDialog(message: string, title: string = "") {
        this.msg.tittle = title;
        this.msg.message = message;
        setTimeout(() => {
            this.Generic(this.msg.message, this.msg.tittle, '', TYPE.SUCCESS);
        }, 1000);
    }

    // Muestra el dialog con sus mensajes y cuando se pulsa Ok dispara el evento
    Generic(content: string, title, $eventClose, typeIcon) {
        this.msg.message = content;
        this.msg.tittle = title;
        Swal.fire({
            title: this.msg.tittle,
            text: this.msg.message,
            icon: typeIcon,
            showCancelButton: false,
            confirmButtonText: this.translate.instant('MSN.ACEPTAR'),
        })

    }

    Ok(content: string = "", title: string = "", $eventClose = null) {
        content = content == "" ? this.translate.instant('MSN.PROCESO_OK') : content;
        title = title == "" ? this.translate.instant('MSN.EXITO') : title;
        this.Generic(content, title, $eventClose, TYPE.SUCCESS);
    }

    OkEvent(content: string = "", title: string = "", $eventOk=null, $eventDenied=null, icon=TYPE.SUCCESS){
        content = content == "" ? this.translate.instant('MSN.PROCESO_OK') : content;
        title = title == "" ? this.translate.instant('MSN.EXITO') : title;
        this.GenericEvent(content, title, $eventOk, $eventDenied, icon);
    }

    GenericEvent(content: string, title: string="", eventOK = null, eventDenied= null,typeIcon=TYPE.SUCCESS) {
        this.msg.message = content;
        this.msg.tittle = title;
        Swal.fire({
            title: this.msg.tittle,
            text: this.msg.message,
            icon: typeIcon,
            showCancelButton: false,
            confirmButtonText: this.translate.instant('MSN.ACEPTAR'),
        })
            .then((result) => {
                if (result.isConfirmed) {
                    if(eventOK != null) eventOK();
                } else if (result.isDenied) {
                    if(eventDenied != null) eventDenied();
                }
            });
    }

    Fail(content: string = "", title: string = "", $eventClose = null) {
        content = content == "" ? this.translate.instant('MSN.PROCESO_KO') : content;
        title = title == "" ? this.translate.instant('MSN.ERROR') : title;
        this.Generic(content, title, $eventClose, TYPE.ERROR);
    }

    SiNo(pregunta: string = "", title: string = "", $eventOk=null, $eventDenied=null, btnSi="Si", btnNo="No", icon=TYPE.QUESTION){
        pregunta = pregunta=="" ? this.translate.instant('MSN.PROCESO_OK') : pregunta;
        title = title == "" ? this.translate.instant('MSN.EXITO') : title;
        this.GenericEventQuestion(pregunta, title, $eventOk, $eventDenied, btnSi, btnNo);
    }

    GenericEventQuestion(content: string, title: string="", eventOK = null, eventDenied= null, botonSi="Si", botonNo="No") {
        this.msg.message = content;
        this.msg.tittle = title;
        Swal.fire({
            title: title,
            text: content,
            icon: TYPE.QUESTION,
            showCancelButton: true,
            confirmButtonText: botonSi,
            cancelButtonText: botonNo
        })
            .then((result) => {
                if (result.isConfirmed) {
                    if(eventOK != null) eventOK();
                }
                else if (result.dismiss === Swal.DismissReason.cancel || result.isDenied) {
                    if(eventDenied != null) eventDenied();
                }
            });
    }

    openDialogConfirm(text: string = "", tittle: string = "") {
        Swal.fire({
            title: tittle,
            text: text,
            icon: TYPE.QUESTION,
            showCancelButton: true,
            confirmButtonText: this.translate.instant('MSN.ACEPTAR'),
            cancelButtonText: this.translate.instant('MSN.CANCELAR')
        }).then((result) => {
            if (result.value) {
                this.aceptar(result.value);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                this.cancel(result.dismiss);
            }
        });
    }

    aceptar(element: any) {
        this.acceptEvent.emit(element);
    }

    cancel(element: any) {
        this.cancelEvent.emit(element);
    }
}
