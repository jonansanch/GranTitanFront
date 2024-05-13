import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ItableComponent } from "../../common/table/itable.component";
import { Router } from "@angular/router";
import { JsonService } from "../../../core/services/common/json.service";
import { LanguageService } from "../../../core/services/language.service";
import { SessionService } from "../../../core/services/session/session.service";
import { ExportService } from "../../../core/services/common/export.service";
import { BookService } from "../../../core/services/app/book.service";
import { BookModel } from "../../../core/models/app/book.model";
/* import { BookCrearModel } from "../../../core/models/app/Book-crear-model"; */
import { DecimalPipe } from "@angular/common";
import { ParametrosSimplesService } from "../../../core/services/common/parametros-simples.service";
import { BookComponent } from "../book.component";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-book-listar',
  templateUrl: './book-listar.component.html',
  styleUrl: './book-listar.component.scss'
})
export class BookListarComponent extends BookComponent implements ItableComponent {

  breadCrumbItems: Array<{}>;
  currentPage = 0;
  totalRecords = 0;

  data: BookModel[];
  filtro: BookModel;
  model: BookModel;
  BookEliminar: BookModel;
  conceptosRecaudo: any = [];
  tipoRecurso: any = [];
  estados: any = [];
  Books: any = [];
  Book: any = [];
  TipoRecurso: any = [];
  parametrica: number = 0;
  estado: string;
  descripcion: string;
  title: string;
  idBook: number;

  objetos: BookModel[];
  listData: BookModel[] = [] as any;

  displayedColumns: string[] = ['nameAutor', 'name', 'library', 'pages', 'price', 'releaseDate','accion'];
  dataSource: MatTableDataSource<BookModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    protected jsonService: JsonService,
    protected translate: TranslateService,
    protected lang: LanguageService,
    protected sessionService: SessionService,
    protected exportService: ExportService,
    public service: BookService,
    protected decimalPipe: DecimalPipe,
    protected parametrosSimplesService: ParametrosSimplesService
  ) {
    super(translate, lang, exportService, decimalPipe, sessionService, jsonService);
    this.title = "Libros";

    //this.getDataFiltro();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Libros" },
      { label: "Listado", active: true },
    ];
    super.ngOnInit();
  }

  async ngAfterViewInit() {
    super.ngAfterViewInit();
    setTimeout(() => {
      this.renderDetails = false;
      this.filtro = new BookModel();      
      this.getDataService();
    });
  }

  async getDataService() {    
    this.service.getAll().subscribe((r: any[]) => {      
      this.objetos = r.map(r => r['body']);      
      console.log(this.objetos);
      this.dataSource = new MatTableDataSource(this.objetos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  };

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  Crear() {
    let item = {
      url: `book/book-crear`,
    };
    this.router.navigateByUrl(item.url);
    console.log('a crear.')
  }

  edit(element: any) {
    try {
      this.sessionService.setItem("bookId", element.id);
      let item = {
        url: `book/Book-editar`
      };
      this.router.navigateByUrl(item.url);
    } catch (error) {
      console.error('Error message', error);
      this.loading = false;
    }
    console.log('a EDITAR.' + element)
  }

  delete(element: any) {
    try {
      console.log("var element",element);
      this.Books = element.id;
      this.accion = 3;
      this.openDialogConfirm(this.translate.instant('MSN.CONFIRMACION'), this.translate.instant('MSN.ELIMINAR'));
    } catch (error) {
      console.error('Error message', error);
      this.loading = false;
    }
  }

  async Eliminar() {
    //this.spinner.show();        
    this.service.delete(this.Books).subscribe({
      next: (data) => {
        console.log('data a eliminar', data);
        this.openDialog(this.translate.instant('MSN.PROCESO_OK'));
        this.Books = 0;
        this.getDataService();
      },
      error: (error) => {
        this.Fail(this.translate.instant('MSN.PROCESO_KO'));
        this.Books = 0;
        this.getDataService();
      }
    })
  }
}
