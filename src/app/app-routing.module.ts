import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { UploadBatchComponent } from './components/upload-batch/upload-batch.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'upload-batch', component: UploadBatchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
