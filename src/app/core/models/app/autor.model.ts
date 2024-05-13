export class AutorModel {
  id: any ;
  firstName: string;
  secondName: string;
  surname: string;
  secondSurname: string;
  birthDate: Date;   
  
    constructor() {
      this.id = '';     
      this.firstName = '';     
      this.secondName = '';     
      this.surname = '';
      this.secondSurname = '';      
      this.birthDate = new Date;
    }
  }
  