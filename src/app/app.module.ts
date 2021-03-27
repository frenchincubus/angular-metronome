import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VizualisationComponent } from './components/vizualisation/vizualisation.component';
import { MetronomeComponent } from './components/metronome/metronome.component';

@NgModule({
  declarations: [
    AppComponent,
    VizualisationComponent,
    MetronomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
