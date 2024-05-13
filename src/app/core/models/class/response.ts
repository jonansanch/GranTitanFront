import {Error} from './error';
import {Success} from './success';

export class Response {

  code: number;
  error: Error;
  success: Success;

  constructor() {
    this.code = 200;
    this.error = new Error();
    this.success = new Success();
  }

}
