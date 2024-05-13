import { Component, inject, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import { Router} from "@angular/router";
import { TranslateService} from "@ngx-translate/core";
import { LanguageService} from "../../../core/services/language.service";
import { PlantillaDetalleService } from 'src/app/core/services/app/plantilla-detalle.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { SpinnerComponent } from '../spinner/spinner.component';
import { CodigosService } from 'src/app/core/services/common/codigos.service';
import { PlantillaService } from 'src/app/core/services/app/plantilla.service';
import { LiquidacionDetalleService } from 'src/app/core/services/app/liquidacion-detalle.service';
import { DomSanitizer } from '@angular/platform-browser';

import pdfMake from 'pdfmake/build/pdfmake';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

export class ModelData {
    tittle: string;
    message: string;
    route: string;
}

@Component({
    selector: 'app-previsualizar-certificado',
    templateUrl: './previsualizar-certificado.component.html',
    styleUrls: ['./Previsualizar-certificado.component.scss']
})
export class PrevisualizarCertificadoComponent implements OnInit {

    private modalService = inject(NgbModal);
    @Input() data: ModelData;
    @ViewChild(SpinnerComponent) public spin: SpinnerComponent

    modalRef: NgbModalRef;
    @ViewChild('template') templateRef: TemplateRef<any>;

    //----------------------------
    previzualizar: boolean = true;
    parrafos: any = {};
    html: any = "";

    constructor(private router: Router,
        protected translate: TranslateService,
        protected plantillaDetalleService: PlantillaDetalleService,
        protected plantillaService: PlantillaService,
        protected liquidacionDetalleService: LiquidacionDetalleService,
        protected lang: LanguageService,
        public codigosService: CodigosService,
        private sanitizer: DomSanitizer
    ) {
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
    }

    ngOnInit() {
        this.translate.setDefaultLang(this.lang.browserLanguage());
        this.data = new ModelData();
        this.data.tittle = "Previsualización";
    }

    async GetParrafos(idPlantilla: any){
        let r: any = await firstValueFrom(this.plantillaDetalleService.getByIdPlantilla(idPlantilla));
        let respuesta = [];
        if(r.resultado != null){            
            respuesta = r.resultado.map(r=> {
                return {
                    idPlantillaParrafo: r.idPlantillaParrafo,
                    tipo: r.tipo,
                    orden: r.orden,
                    tag: r.tag,
                    texto: r.texto,
                    negrita: r.negrita,
                    cursiva: r.cursiva,
                    tamano: r.tamano,
                    alineacion: r.alineacion,
                };
            });
        }
        return respuesta;
    }

    async GetPlantilla(idPlantilla: any){
        let r: any = await firstValueFrom(this.plantillaService.get(idPlantilla));
        return {
            idPlantilla: r.idPlantilla,
            nombre: r.nombre,
            urlPlantilla: r.urlPlantilla,
            html: r.html
        };
    }

    async GetCertificadoLiquidacion(idLiquidacion: any){
        let r: any = await firstValueFrom(this.liquidacionDetalleService.GetCertificado(idLiquidacion));
        return {
            idLiquidacion: r.idLiquidacion,
            idLiquidacionCertificado: r.idLiquidacionCertificado,
            json: r.json,
            radicado: r.radicado,
            radicadoFecha: r.radicadoFecha
        };
    }

    async GetCertificadoLiquidacionJson(idLiquidacion: any){
        let r: any = await firstValueFrom(this.liquidacionDetalleService.GetCertificado(idLiquidacion));
        return r !=null ? r.json : null;
    }

    async show(idPlantilla: any="1", tokens: any="") {        
        // Abro el modal
        this.modalRef = this.modalService.open(this.templateRef, {ariaLabelledBy: 'modal-basic-title', centered: true});
    }

    async GenerarHTML(json: any) {
        console.log(json);
        let j = JSON.parse(json);
        console.log("j::::: ",j);
        this.html = `${j.plantilla.html}`;

        for (const p of j.parrafos) {

            // ---------- Parrafos Tipo texto --------------

            if(p.tipo.toUpperCase().includes("TEX")){
                let par=`<p style="font-size: ${p.tamano}px; font-weight: ${p.negrita ? 'bold': 'normal'}; font-style: ${p.cursiva ? 'italic': 'normal'}">
                    ${p.texto}
                </p>`;

                this.html = this.html.split(p.tag).join(par);
            }
            
            // ---------- Parrafos Tipo Tabla --------------
            if(p.tipo.toUpperCase().includes("TAB")){
                // Aca se colocarian los tipos de tablas
                if(j.detalle != null){
                    const tabla = this.GenerarTabla(j.detalle);
                    this.html = this.html.split(p.tag).join(tabla.outerHTML);
                }                
            }
            
            // ---------- Parrafos Tipo Imagen --------------
            if(p.tipo.toUpperCase().includes("IMG")){
                let base64 = await this.plantillaDetalleService.urlToBase64(p.texto);
                let par = `<img src='${base64}' style='max-height: 100px' alt='Logo' />`;
                this.html = this.html.split(p.tag).join(par);
            }
            
        }
        // Se coloca el html como seguro, para que no quite estilos
        this.html = this.sanitizer.bypassSecurityTrustHtml(this.html);
        console.log(this.html);
    }

    GenerarTabla(arrayObjetos: any): HTMLTableElement {
        // Get unique properties from objects (assuming no object has a property named "hasOwnProperty")
        const propiedades = new Set<string>();
        for (const objeto of arrayObjetos) {
          for (const propiedad in objeto) {
            propiedades.add(propiedad);
          }
        }
      
        const tabla = document.createElement("table");
        const encabezado = document.createElement("thead");
        const cuerpo = document.createElement("tbody");
      
        // Encabezado
        const filaEncabezado = document.createElement("tr");
        for (const propiedad of propiedades) {
          const celda = document.createElement("th");
          celda.textContent = propiedad;
          filaEncabezado.appendChild(celda);
        }
        encabezado.appendChild(filaEncabezado);
      
        // Datos
        for (const objeto of arrayObjetos) {
          const filaDatos = document.createElement("tr");
          for (const propiedad of propiedades) {
            const celda = document.createElement("td");
            celda.textContent = objeto[propiedad] as string; // Assuming properties are strings, adjust type as needed
            filaDatos.appendChild(celda);
          }
          cuerpo.appendChild(filaDatos);
        }
      
        tabla.appendChild(encabezado);
        tabla.appendChild(cuerpo);
      
        return tabla;
    }

    GenerarTablaLiquidacion(){
        
    }

    async GetPlantillaDefecto(parametro){
        let r: any = await lastValueFrom(this.codigosService.GetParametros(parametro));
        if(r != null && r.length > 0){
            return r[0].valor;
        }
        return "";
    }

    close() {
        this.modalRef.close(false);
    }

    convertHtmlToPdfmake(html: string) {
       return htmlToPdfmake(html, {   });
    }    

    toPDF(){
        let html: any = document.getElementById("htmlPdf")?.innerHTML;
        let pdfDefinition: any = { content: this.convertHtmlToPdfmake(html) };
        pdfMake.createPdf(pdfDefinition).open();            
    }

    reemplazarValores(tokens, parrafo) {
        for (let key in tokens) {
          if (tokens.hasOwnProperty(key)) {
            parrafo = parrafo.split(key).join(tokens[`${key}`])
          }
        }
        return parrafo;
    }    

}
