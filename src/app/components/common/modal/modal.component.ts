import {Component, inject, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
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
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

    private modalService = inject(NgbModal);
    @Input() data: ModelData;
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

    openDialog(message: string, title: string = "", route: string = "") {
        this.modalRef = this.modalService.open(this.templateRef, {ariaLabelledBy: 'modal-basic-title', centered: true});
        this.data.tittle = title;
        this.data.message = message;
    }

    // Muestra el dialog con sus mensajes y cuando se pulsa Ok dispara el evento
    Generic(content: string, title: string = "", $eventClose=null) {
        this.data.message = content;
        this.data.tittle = title;
        this.modalRef = this.modalService.open(this.templateRef, {ariaLabelledBy: 'modal-basic-title', centered: true});

        // Evento cuando cierra
        if($eventClose != null){
            this.modalRef.close();
        }
    }

    Ok(content: string="", title: string = "", $eventClose=null) {
        content = content =="" ? this.translate.instant('MSN.PROCESO_OK') : content;
        title = title =="" ? this.translate.instant('MSN.EXITO') : title;
        this.Generic(content, title, $eventClose);
    }

    Fail(content: string="", title: string = "", $eventClose=null) {
        content = content =="" ? this.translate.instant('MSN.PROCESO_KO') : content;
        title = title =="" ? this.translate.instant('MSN.ERROR') : title;
        this.Generic(content, title, $eventClose);
    }


    close(element: any, route: string = "") {
        this.modalRef.close(false);
        if (route) {
            this.router.navigate([route]);
        }
    }
}
