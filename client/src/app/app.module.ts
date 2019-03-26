import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { routing, appRoutingProviders } from './app.routing';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserEditComponent } from './components/user-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    UserEditComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
