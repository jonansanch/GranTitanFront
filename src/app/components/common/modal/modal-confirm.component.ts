import {Component, EventEmitter, inject, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../core/services/language.service";

export class ModelData {
    tittle: string;
    message: string;
    route: string;
}

@Component({
    selector: 'app-modal-confirm',
    templateUrl: './modal-confirm.component.html',
    styleUrls: ['./modal-confirm.component.scss']
})
export class ModalConfirmComponent implements OnInit {

    private modalService = inject(NgbModal);
    @Input() data: ModelData;
    @Output() aceptarEvent = new EventEmitter<any>();
    @Output() cancelarEvent = new EventEmitter<any>();
    // 1. crear 2. actualizar 3. eliminar
    @Input() accion: number;
    closeResult = '';
    modalRef: NgbModalRef;
    @ViewChild('template') templateRef: TemplateRef<any>;

    constructor(public activeModal: NgbActiveModal,
                private router: Router,
                protected translate: TranslateService,
                protected lang: LanguageService,) {
    }

    ngOnInit() {
        this.translate.setDefaultLang(this.lang.browserLanguage());
        this.data = new ModelData();
    }

    openDialogConfirm(message: string, title: string = "") {
        this.data.message = message;
        this.data.tittle = title;
        this.modalRef = this.modalService.open(this.templateRef, {ariaLabelledBy: 'modal-basic-title', centered: true});
        this.modalRef.result.then(
            (aceptar: boolean) => {
                if (aceptar) {
                    this.aceptarEvent.emit('');
                } else {
                    this.cancelarEvent.emit('');
                }
            }
        );
    }

    confirm(message: string="", title: string="", $eventClose=null) {

        this.data.message = message;
        this.data.tittle = title;
        this.modalRef = this.modalService.open(this.templateRef, {ariaLabelledBy: 'modal-basic-title', centered: true});

        // Evento cuando cierra
        if($eventClose != null){
            this.modalRef.close(true);
        }
    }

    aceptar(element: any) {
        this.modalRef.close(true);
    }

    close(element: any) {
        this.modalRef.close(false);
    }
}
