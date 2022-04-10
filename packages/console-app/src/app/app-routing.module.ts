import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { PersonsComponent } from './persons/persons.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: MenuComponent },
  {
    path: 'persons',
    component: PersonsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
