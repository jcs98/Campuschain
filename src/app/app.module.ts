import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { UploadBatchComponent } from './components/upload-batch/upload-batch.component';
import { VerifyLeafComponent } from './components/verify-leaf/verify-leaf.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HttpClientModule } from "@angular/common/http";
import { HomeComponent } from './components/home/home.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { CertificatesComponent } from './components/certificates/certificates.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { BulkPaymentsComponent } from './components/bulk-payments/bulk-payments.component';
import { VerifyCertificateComponent } from './components/verify-certificate/verify-certificate.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UploadBatchComponent,
    VerifyLeafComponent,
    NavbarComponent,
    HomeComponent,
    PaymentsComponent,
    CertificatesComponent,
    DocumentsComponent,
    BulkPaymentsComponent,
    VerifyCertificateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    QRCodeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
