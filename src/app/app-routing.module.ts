import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { UploadBatchComponent } from './components/upload-batch/upload-batch.component';
import { VerifyLeafComponent } from './components/verify-leaf/verify-leaf.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { CertificatesComponent } from './components/certificates/certificates.component';
import { VerifyCertificateComponent } from './components/verify-certificate/verify-certificate.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { BulkPaymentsComponent } from './components/bulk-payments/bulk-payments.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'upload-batch', component: UploadBatchComponent },
  { path: 'verify-leaf', component: VerifyLeafComponent } //,
  // { path: 'payments', component: PaymentsComponent },
  // { path: 'certificates', component: CertificatesComponent },
  // { path: 'verify-certificate', component: VerifyCertificateComponent },
  // { path: 'documents', component: DocumentsComponent },
  // { path: 'bulk-payments', component: BulkPaymentsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
