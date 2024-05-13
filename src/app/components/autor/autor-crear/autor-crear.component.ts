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
  selector: 'app-autor-crear',
  templateUrl: './autor-crear.component.html',
  styleUrl: './autor-crear.component.scss'
})
export class AutorCrearComponent extends FormComponent
  implements OnInit, AfterViewInit {

  formGroup: FormGroup;
  formGroupExtra: FormGroup;
  breadCrumbItems: Array<{}>;
  title: string;
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
  estado: boolean;
  tipoRecurso: number;
  banco: number;
  numeroCuenta: number;
  nombreConcepto: string;
  secuenciaERP: number;
  model: AutorCrearModel;
  Autores: any = [];

  constructor(
    private router: Router,
    protected jsonService: JsonService,
    protected translate: TranslateService,
    protected lang: LanguageService,
    protected sessionService: SessionService,
    protected exportService: ExportService,
    protected decimalPipe: DecimalPipe,
    protected formBuilder: FormBuilder,
    public service: AutorService,
    public autorservice: AutorService,
    protected parametrosSimplesService: ParametrosSimplesService
  ) {
    super(translate, lang, formBuilder);
    this.title = "Libro";
    this.formGroupExtra = this.formBuilder.group({
      firstName: '',
      secondName: '',
      surname: '',
      secondSurname: '',
      birthDate: '',
    });
  }

  async ngOnInit() {
    super.ngOnInit();
    this.breadCrumbItems = [
      { label: "Libro" },
      { label: this.translate.instant("MSN.AGREGAR"), active: true },
    ];
    await this.getDataFiltro();
  }

  ngAfterViewInit(): void {
  }

  async getDataFiltro() {
    this.autorservice.getAll().subscribe((r: any[]) => {
      this.Autores = r.map(r => r['body']);
      console.log(this.Autores, "autores");
    });
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
      this.Fail("Todos los campos con bordes rojos son obligatorios, favor diligenciarlos.", "Validación");
      return;
    }

    /* this.AutorService.create(this.model).subscribe({
      next: (data) => {
        this.Ok();
        this.router.navigateByUrl("autor/autor-listar");
      },
    }); */
  }

  async setValuesModel() {
    this.model = this.formGroup.getRawValue();
    //this.model.secondName = this.formGroup.controls.secondName.value;//this.formGroup.get("secondName").value;
    //this.model.secondSurname = this.formGroup.controls.secondSurname.value;//this.formGroup.get("secondSurname").value;
  }

}
