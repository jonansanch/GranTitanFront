import { AutorCrearModel } from "./autor-crear-model";

export class BookModel {
  id: any ;
  authorId: any;
  name: string;
  library: string;
  pages: number;
  price: number;   
  releaseDate: Date;     
  nameAutor:string  
  
    constructor() {
      this.id = '';     
      this.authorId = '';     
      this.name = '';     
      this.library = '';
      this.pages = 0;      
      this.price = 0;      
      this.releaseDate = new Date;      
      this.nameAutor = '';
    }
  }
  