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
import { name } from "@azure/msal-angular/packageMetadata";
//import { CuentaBancoService } from "../../../core/services/app/cuenta-banco.service";

@Component({
  selector: 'app-book-editar',
  templateUrl: './book-editar.component.html',
  styleUrl: './book-editar.component.scss'
})
export class BookEditarComponent extends FormComponent
  implements OnInit, AfterViewInit {

  breadCrumbItems: Array<{}>;
  title: string;
  model: BookCrearModel;
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
  idBook: string;
  Autores: any = [];
  autor: any;
  //formGroup: FormGroup;

  constructor(
    private router: Router,
    private BookService: BookService,
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
    this.title = "Editar Libro";    
    this.getDataFiltro();
  }


  async ngOnInit() {
    // Se trae el Id 
    this.idBook = await this.sessionService.getItem("bookId");
    console.log('id a editar ', this.idBook);
    if (this.idBook != '') {
      this.model = await this.getDataFormulario(this.idBook);
      console.log('modelo a editar', this.model);
      
      let fecFormat = JSON.stringify(this.model.releaseDate).substr(1, 10);

      this.autor = this.model.authorId;

      this.formGroup.setValue({        
        name: this.model.name,        
        library: this.model.library,        
        pages: this.model.pages,        
        price: this.model.price,        
        releaseDate: fecFormat,
      });
      
    }
  }

  async ngAfterViewInit() {
    this.spinner.show();
    this.spinner.hide();
  }

  async getDataFiltro() {
    this.autorservice.getAll().subscribe((r: any[]) => {      
      this.Autores = r.map(r => r['body']);      
      console.log(this.Autores,"autores");
    });
  }

  async getDataFormulario(id: string) {
    console.log("getDataFormulario id", id)
    return await lastValueFrom(this.BookService.get(id));
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
    
    this.BookService.update(this.model).subscribe({
      next: (data) => {
        this.Ok();
        this.router.navigateByUrl("book/book-listar");
      },
    });
  }

  async setValuesModel() {    
    this.model = this.formGroup.getRawValue();   
    this.model.id = this.idBook; 
    this.model.authorId = this.autor;
  }

}
