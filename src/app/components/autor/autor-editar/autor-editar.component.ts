import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { Mensaje } from "src/app/core/models/mensaje.model";
import { JsonService } from "../../../core/services/common/json.service";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "../../../core/services/language.service";
import { SessionService } from "../../../core/services/session/session.service";
import { AutorService } from "../../../core/services/app/autor.service";
import { ParametrosSimplesService } from "../../../core/services/common/parametros-simples.service";
import { ExportService } from "../../../core/services/common/export.service";
import { DecimalPipe } from "@angular/common";
import { AutorCrearModel } from "../../../core/models/app/autor-crear-model";
import { FormComponent } from "../../common/form/form.component";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
//import { ModalProcesoInternoComponent } from "../../common/modal/modal-proceso-interno.component";
import { lastValueFrom } from "rxjs";
import { dA } from "@fullcalendar/core/internal-common";
//import { CuentaBancoService } from "../../../core/services/app/cuenta-banco.service";

@Component({
  selector: 'app-autor-editar',
  templateUrl: './autor-editar.component.html',
  styleUrl: './autor-editar.component.scss'
})
export class AutorEditarComponent extends FormComponent
  implements OnInit, AfterViewInit {

  breadCrumbItems: Array<{}>;
  title: string;
  model: AutorCrearModel;
  mensaje: Mensaje = new Mensaje();
  msgError: any = "";
  guardarDisabled: any = true;
  bancos: any = [];
  estados: any = [{ Estado: "Activo", value: true }, { Estado: "Inactivo", value: false }];
  tipoCuentas: any = [];
  TipoRecurso: any = [];
  cuentasBancos: any = [];
  URL: string;
  descripcion: string;
  estado: string;
  tipoRecurso: number;
  banco: number;
  numeroCuenta: number;
  nombreConcepto: string;
  secuenciaERP: number;
  idAutor: string;
  //formGroup: FormGroup;

  constructor(
    private router: Router,
    private AutorService: AutorService,
    protected jsonService: JsonService,
    protected translate: TranslateService,
    protected lang: LanguageService,
    protected sessionService: SessionService,
    protected exportService: ExportService,
    protected decimalPipe: DecimalPipe,
    protected formBuilder: FormBuilder,
    public service: AutorService,
    //public serviceBanco: CuentaBancoService,
    protected parametrosSimplesService: ParametrosSimplesService
  ) {
    super(translate, lang, formBuilder);
    this.title = "Editar autor";    
  }


  async ngOnInit() {
    // Se trae el Id 
    this.idAutor = await this.sessionService.getItem("AutorId");
    console.log('id a editar ', this.idAutor);
    if (this.idAutor != '') {
      this.model = await this.getDataFormulario(this.idAutor);
      console.log('modelo a editar', this.model);
      
      let fecFormat = JSON.stringify(this.model.birthDate).substr(1, 10);
      console.log(fecFormat,"fec")

      this.formGroup.setValue({        
        firstName: this.model.firstName,        
        secondName: this.model.secondName,        
        surname: this.model.surname,        
        secondSurname: this.model.secondSurname,        
        birthDate: fecFormat,
      });
      
    }
  }

  async ngAfterViewInit() {
    this.spinner.show();
    this.spinner.hide();
  }

  async getDataFormulario(id: string) {
    console.log("getDataFormulario id", id)
    return await lastValueFrom(this.AutorService.get(id));
  }

  cancelar() {
    let url = "autor/autor-listar";
    this.router.navigateByUrl(url);
  }

  validateForm() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return false;
    }
  }

  async guardar() {
    await this.setValuesModel();
    console.log('valores form', this.model);

    if (this.validateForm() === false) {      
      this.Fail("Todos los campos con bordes rojos son obligatorios, favor diligenciarlos.","Validación");
      return;
    }

    this.AutorService.update(this.model).subscribe({
      next: (data) => {
        this.Ok();
        this.router.navigateByUrl("autor/autor-listar");
      },
    });
  }

  async setValuesModel() {    
    this.model = this.formGroup.getRawValue();   
    this.model.id = this.idAutor; 
  }

}
