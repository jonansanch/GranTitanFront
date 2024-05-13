import {Error} from './error';
import {Success} from './success';

export interface Response {

  code: number;
  error: Error;
  success: Success;
}
