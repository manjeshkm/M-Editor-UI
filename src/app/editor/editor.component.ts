import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import * as ace from 'ace-builds';
import 'ace-builds/webpack-resolver';
import {languageModuleMap} from '../constants/language-libmodule-map';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';

const LANG = 'ace/mode/javascript';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, OnChanges {

  @Input() selectedTheme;
  @Input() lang;
  @Output() code = new EventEmitter<string>();
  @ViewChild('codeEditor', {static: true}) codeEditorElmRef: ElementRef;
  private codeEditor: ace.Ace.Editor;
  private editorBeautify;

  constructor() {
  }

  ngOnInit() {
    ace.require('ace/ext/language_tools');
    this.editorBeautify = ace.require('ace/ext/beautify');
    this.beautifyContent();
    this.getCode();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const element = this.codeEditorElmRef.nativeElement;
    const editorOptions = this.getEditorOptions();

    this.codeEditor = ace.edit(element, editorOptions);
    this.setEditorTheme(this.selectedTheme);
    this.setLanguageMode(this.lang);
    this.codeEditor.setShowFoldWidgets(true); // for the scope fold feature
  }

  private getEditorOptions(): Partial<ace.Ace.EditorOptions> & { [key: string]: boolean; } {
    const basicEditorOptions: Partial<ace.Ace.EditorOptions> = {
      highlightActiveLine: true,
      minLines: 14,
      maxLines: Infinity,
    };

    const extraEditorOptions = {
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true
    };
    const margedOptions = Object.assign(basicEditorOptions, extraEditorOptions);
    return margedOptions;
  }

  public beautifyContent() {
    if (this.codeEditor && this.editorBeautify) {
      const session = this.codeEditor.getSession();
      this.editorBeautify.beautify(session);
    }
  }

  private getCode() {
    if (this.codeEditor) {
      const code = this.codeEditor.getValue();
      return code;
    }
  }

  public setContent(content: string): void {
    if (this.codeEditor) {
      this.codeEditor.setValue(content);
    }
  }

  public setLanguageMode(langMode: string): void {
    try {
      if (languageModuleMap.has(langMode)) {
        const langModeModulePath = languageModuleMap.get(langMode);
        this.codeEditor.getSession().setMode(langModeModulePath, () => {
          console.log('set: ', langMode);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  public setEditorTheme(mode: string) {
    if (this.selectedTheme === 'dark') {
      this.codeEditor.setTheme('ace/theme/cobalt');
    } else {
      this.codeEditor.setTheme('ace/theme/iplastic');
    }
  }

  public OnContentChange(callback: (content: string, delta: ace.Ace.Delta) => void): void {
    this.codeEditor.on('change', (delta) => {
      const content = this.codeEditor.getValue();
      callback(content, delta);
    });
  }

  run() {
    this.beautifyContent();
    this.code.emit(this.getCode());
  }
}
