import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './home/home.component';
import { GestUsersComponent } from './components/gest-users/gest-users.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { AdminGuard } from './guards/admin.guard';
import { EditUserComponent } from './components/edit-user/edit-user.component';


export const routes: Routes = [
{ path: 'register', component: RegisterComponent },     
{ path : 'home', component: HomeComponent},
{ path: '', redirectTo: 'login', pathMatch: 'full' },
{ path: 'login', component: LoginComponent },
{ path: 'gestUsers', component: GestUsersComponent , canActivate: [AdminGuard]},     
{ path: 'adduser', component: AddUserComponent , canActivate: [AdminGuard]}, 
{ path: 'edituser/:id', component: EditUserComponent, canActivate: [AdminGuard] },
{ path: '**', component: LoginComponent } 


];


