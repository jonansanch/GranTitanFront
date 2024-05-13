import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ItableComponent } from "../../common/table/itable.component";
import { Router } from "@angular/router";
import { JsonService } from "../../../core/services/common/json.service";
import { LanguageService } from "../../../core/services/language.service";
import { SessionService } from "../../../core/services/session/session.service";
import { ExportService } from "../../../core/services/common/export.service";
import { AutorService } from "../../../core/services/app/autor.service";
import { AutorModel } from "../../../core/models/app/autor.model";
/* import { AutorCrearModel } from "../../../core/models/app/autor-crear-model"; */
import { DecimalPipe } from "@angular/common";
import { ParametrosSimplesService } from "../../../core/services/common/parametros-simples.service";
import { AutorComponent } from "../autor.component";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-autor-listar',
  templateUrl: './autor-listar.component.html',
  styleUrl: './autor-listar.component.scss'
})
export class AutorListarComponent extends AutorComponent implements ItableComponent {

  breadCrumbItems: Array<{}>;
  currentPage = 0;
  totalRecords = 0;

  data: AutorModel[];
  filtro: AutorModel;
  model: AutorModel;
  AutorEliminar: AutorModel;
  conceptosRecaudo: any = [];
  tipoRecurso: any = [];
  estados: any = [];
  Autors: any = [];
  Autor: any = [];
  TipoRecurso: any = [];
  parametrica: number = 0;
  estado: string;
  descripcion: string;
  title: string;
  idAutor: number;

  objetos: AutorModel[];
  listData: AutorModel[] = [] as any;

  displayedColumns: string[] = ['firstName', 'surname', 'accion'];
  dataSource: MatTableDataSource<AutorModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    protected jsonService: JsonService,
    protected translate: TranslateService,
    protected lang: LanguageService,
    protected sessionService: SessionService,
    protected exportService: ExportService,
    public service: AutorService,
    protected decimalPipe: DecimalPipe,
    protected parametrosSimplesService: ParametrosSimplesService
  ) {
    super(translate, lang, exportService, decimalPipe, sessionService, jsonService);
    this.title = "Autores";

    //this.getDataFiltro();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Autores" },
      { label: "Listado", active: true },
    ];
    super.ngOnInit();
  }

  async ngAfterViewInit() {
    super.ngAfterViewInit();
    setTimeout(() => {
      this.renderDetails = false;
      this.filtro = new AutorModel();
      this.addColumns();      
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
      url: `autor/autor-crear`,
    };
    this.router.navigateByUrl(item.url);
    console.log('a crear.')
  }

  edit(element: any) {
    try {
      this.sessionService.setItem("AutorId", element.id);
      let item = {
        url: `autor/autor-editar`
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
      this.Autors = element.id;
      this.accion = 3;
      this.openDialogConfirm(this.translate.instant('MSN.CONFIRMACION'), this.translate.instant('MSN.ELIMINAR'));
    } catch (error) {
      console.error('Error message', error);
      this.loading = false;
    }
  }

  async Eliminar() {
    //this.spinner.show();        
    this.service.delete(this.Autors).subscribe({
      next: (data) => {
        console.log('data a eliminar', data);
        this.openDialog(this.translate.instant('MSN.PROCESO_OK'));
        this.Autors = 0;
        this.getDataService();
      },
      error: (error) => {
        this.Fail(this.translate.instant('MSN.PROCESO_KO'));
        this.Autors = 0;
        this.getDataService();
      }
    })
  }
}
