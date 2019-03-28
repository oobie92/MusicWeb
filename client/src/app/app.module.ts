import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { routing, appRoutingProviders } from './app.routing';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { UserEditComponent } from './components/user-edit.component';
import { HomeComponent } from './components/home.component';
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    UserEditComponent,
    HomeComponent,
    ArtistListComponent,
    ArtistAddComponent,
    ArtistEditComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    RouterModule,
    routing
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
