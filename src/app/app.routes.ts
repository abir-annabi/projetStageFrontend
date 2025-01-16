import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
{ path: 'register', component: RegisterComponent },     
{ path : 'home', component: HomeComponent},
{ path: '', redirectTo: 'home', pathMatch: 'full' },
{ path: 'login', component: LoginComponent },
{ path: 'dashboard', component: DashboardComponent },      

];


