import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { Mensaje } from "src/app/core/models/mensaje.model";
import { JsonService } from "../../../core/services/common/json.service";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "../../../core/services/language.service";
import { SessionService } from "../../../core/services/session/session.service";
import { BookService } from "../../../core/services/app/book.service";
import { ParametrosSimplesService } from "../../../core/services/common/parametros-simples.service";
import { ExportService } from "../../../core/services/common/export.service";
import { DecimalPipe } from "@angular/common";
import { BookCrearModel } from "../../../core/models/app/book-crear-model";
import { FormComponent } from "../../common/form/form.component";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
//import { ModalProcesoInternoComponent } from "../../common/modal/modal-proceso-interno.component";
import { lastValueFrom } from "rxjs";
import { dA } from "@fullcalendar/core/internal-common";
import { AutorService } from "src/app/core/services/app/autor.service";
//import { CuentaBancoService } from "../../../core/services/app/cuenta-banco.service";

@Component({
  selector: 'app-book-crear',
  templateUrl: './book-crear.component.html',
  styleUrl: './book-crear.component.scss'
})
export class BookCrearComponent extends FormComponent
  implements OnInit, AfterViewInit {

  formGroup: FormGroup;
  breadCrumbItems: Array<{}>;
  title: string;
  mensaje: Mensaje = new Mensaje();
  msgError: any = "";
  guardarDisabled: any = true;
  bancos: any = [];
  estados: any = [{ Estado: "Activo", value: true }, { Estado: "Inactivo", value: false }];
  autors: any = [];
  Autores: any = [];
  cuentasBancos: any = [];
  URL: string;
  descripcion: string;
  estado: boolean;
  autor: any;
  banco: number;
  numeroCuenta: number;
  nombreConcepto: string;
  secuenciaERP: number;
  model: BookCrearModel;

  constructor(
    private router: Router,
    private bookService: BookService,
    protected jsonService: JsonService,
    protected translate: TranslateService,
    protected lang: LanguageService,
    protected sessionService: SessionService,
    protected exportService: ExportService,
    protected decimalPipe: DecimalPipe,
    protected formBuilder: FormBuilder,
    public service: BookService,
    public autorservice: AutorService,
    protected parametrosSimplesService: ParametrosSimplesService
  ) {
    super(translate, lang, formBuilder);
    this.title = "Libro";
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
    let url = "book/book-listar";
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

    this.bookService.create(this.model).subscribe({
      next: (data) => {
        this.Ok();
        this.router.navigateByUrl("book/book-listar");
      },
    });
  }

  async setValuesModel() {
    this.model = this.formGroup.getRawValue();
    this.model.authorId = this.autor;
  }

}
