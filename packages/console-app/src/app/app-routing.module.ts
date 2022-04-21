import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractsComponent } from './contracts/contracts.component';
import { DebugComponent } from './debug/debug.component';
import { MenuComponent } from './menu/menu.component';
import { PersonsComponent } from './persons/persons.component';
import { RolesComponent } from './roles/roles.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: MenuComponent },
  {
    path: 'persons',
    component: PersonsComponent,
  },
  {
    path: 'contracts',
    component: ContractsComponent,
  },
  {
    path: 'roles',
    component: RolesComponent,
  },
  {
    path: 'debug',
    component: DebugComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
