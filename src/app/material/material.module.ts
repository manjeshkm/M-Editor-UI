import { NgModule } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {
  MatButtonModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatSelect,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule
} from '@angular/material';


const MaterialModules = [MatToolbarModule, MatButtonModule, MatSelectModule, MatSlideToggleModule,
  MatExpansionModule, MatProgressSpinnerModule];
@NgModule({
  imports: [
    MaterialModules
  ],
  exports: [
    MaterialModules
  ]
})
export class MaterialModule { }
