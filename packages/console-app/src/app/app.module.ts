import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContractsComponent } from './contracts/contracts.component';
import { ContractsRegisterComponent } from './contracts/register/register.component';
import { ContractsListComponent } from './contracts/list/list.component';
import { PersonsComponent } from './persons/persons.component';
import { PersonsRegisterComponent } from './persons/register/register.component';
import { PersonsListComponent } from './persons/list/list.component';
import { MenuComponent } from './menu/menu.component';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DebugComponent } from './debug/debug.component';
import { RolesComponent } from './roles/roles.component';

@NgModule({
  declarations: [
    AppComponent,
    PersonsComponent,
    PersonsRegisterComponent,
    PersonsListComponent,
    MenuComponent,
    DebugComponent,
    RolesComponent,
    ContractsComponent,
    ContractsRegisterComponent,
    ContractsListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
