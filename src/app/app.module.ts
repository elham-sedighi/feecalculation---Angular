import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatToolbarModule} from "@angular/material/toolbar";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {StoreModule} from '@ngrx/store';
import {reducers, metaReducers} from './reducers';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {EffectsModule} from "@ngrx/effects";
import {FeeConfigEffect} from "./effects/feeConfig.effect";
import {FileEffect} from "./effects/file.effect";
import {FeeEffect} from "./effects/fee.effect";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatToolbarModule,
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    HttpClientModule,
    EffectsModule.forRoot([
      FeeConfigEffect,
      FileEffect,
      FeeEffect
    ]),
    StoreModule.forRoot(reducers, {metaReducers}),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
