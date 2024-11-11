import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PowerbiComponent } from './powerbi/powerbi.component';
import { UserComponent } from './user/user.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SubmenuComponent } from './submenu/submenu.component';
import { FooterComponent } from './footer/footer.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    PowerbiComponent,
    UserComponent,
    SubmenuComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
