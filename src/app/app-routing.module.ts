import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { UploadBatchComponent } from './components/upload-batch/upload-batch.component';
import { VerifyLeafComponent } from './components/verify-leaf/verify-leaf.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'upload-batch', component: UploadBatchComponent },
  { path: 'verify-leaf', component: VerifyLeafComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
