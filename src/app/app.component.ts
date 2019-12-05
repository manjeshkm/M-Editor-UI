import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpService} from './service/http/http.service';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {LanguageModel} from './models/language.model';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  form = new FormGroup({
    languageControl: new FormControl('', [Validators.required]),
    versionControl: new FormControl('', [Validators.required])
  });
  languages = new Array<string>();
  versions = new Array<string>();
  // tslint:disable-next-line:variable-name
  lang_langmodel = new Map<string, LanguageModel[]>();
  selectedLang: string;
  selectedLangVersion: string;
  title = 'Manjitor';
  checked = true;
  theme = 'dark';
  panelOpenState = false;
  output: JdoodleResponseBody = {
    output: '',
    memory: '',
    cpuTime: '',
    statusCode: null
  };
  loading = false;

  constructor(private http: HttpService) {
    this.http.getLangs().subscribe((data: Map<string, LanguageModel[]>) => {
      data.forEach((val, key) => {
        this.lang_langmodel = data;
        this.languages.push(key);
      });
    });
  }

  ngOnInit(): void {
  }

  setTheme() {
    this.checked = !this.checked;
    if (this.checked) {
      this.theme = 'dark';
    } else {
      this.theme = 'light';
    }
  }

  setlang() {
    this.versions = [];
    this.form.get('versionControl').setValue(null);
    this.selectedLang = this.form.get('languageControl').value;
    console.log('selectedLang:', this.selectedLang);
    console.log('vers available:', this.lang_langmodel.get(this.selectedLang));
    this.lang_langmodel.get(this.selectedLang).forEach(ver => this.versions.push(ver.version));
  }

  runCode($event: string) {
    if (!this.form.valid) {
      console.log(`valid form: ${this.form.valid}`);
      this.form.markAllAsTouched();
    } else {
      this.loading = true;
      console.log(`code: ${$event}`);
      this.http.runCode({
        program: $event,
        version: this.selectedLangVersion,
        lang: this.selectedLang
      }).subscribe((res: JdoodleResponseBody) => {
          this.output = res;
          console.log(`output:${this.output.output}`);
        }, (error: HttpErrorResponse) => {
          console.error(error);
          this.output.statusCode = error.status;
          this.output.output = error.error + ' server error';
          this.panelOpenState = true;
          this.loading = false;
        }, () => {
          this.panelOpenState = true;
          this.loading = false;
        }
      );
    }
  }

  setVersion() {
    this.selectedLangVersion = this.form.get('versionControl').value;
    console.log(`verSeleted: ${this.selectedLangVersion}`);
  }
}
