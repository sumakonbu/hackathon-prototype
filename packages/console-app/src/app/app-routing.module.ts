import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokensComponent } from './tokens/tokens.component';

const routes: Routes = [{path:"tokens",component:TokensComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
