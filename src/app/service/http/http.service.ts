import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {LanguageModel} from '../../models/language.model';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) {
  }

  public getLangs(): Observable<Map<string, LanguageModel[]>> {
    const url = environment.BASE_URL + 'langs/';
    try {
      // @ts-ignore
      return this.http.get(url).pipe(map( data => new Map<string, LanguageModel[]>(data)));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public runCode(requestBody: object): Observable<JdoodleResponseBody> {
    const url = environment.BASE_URL + 'run/';
    try {
      // @ts-ignore
      return this.http.post(url, requestBody).pipe(map(res => res.runResult));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

