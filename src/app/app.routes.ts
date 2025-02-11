import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './home/home.component';
import { GestUsersComponent } from './components/gest-users/gest-users.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { AdminGuard } from './guards/admin.guard';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { VerificationComponent } from './components/verifivation/verifivation.component';
import { GestSignataireComponent } from './components/gest-signataire/gest-signataire.component';
import { AddSignataireComponent } from './components/add-signataire/add-signataire.component';
import { EditSignataireComponent } from './components/edit-signataire/edit-signataire.component';
import { GestStructComponent } from './components/gest-struct/gest-struct.component';
import { AddStructComponent } from './components/add-struct/add-struct.component';
import { EditStructComponent } from './components/edit-struct/edit-struct.component';
import { GestTypeComponent } from './components/gest-type/gest-type.component';
import { AddTypeComponent } from './components/add-type/add-type.component';
import { EditTypeComponent } from './components/edit-type/edit-type.component';
import { GestTypeDemandeComponent } from './components/gest-type-demande/gest-type-demande.component';



export const routes: Routes = [
{ path: 'register', component: RegisterComponent },     
{ path : 'home', component: HomeComponent},
{ path: '', redirectTo: 'login', pathMatch: 'full' },
{ path: 'login', component: LoginComponent },
{ path: 'gestUsers', component: GestUsersComponent , canActivate: [AdminGuard]},     
{ path: 'adduser', component: AddUserComponent , canActivate: [AdminGuard]}, 
{ path: 'edituser/:id', component: EditUserComponent, canActivate: [AdminGuard] },
{ path: 'verification', component: VerificationComponent },
{ path: 'gestSign', component: GestSignataireComponent ,canActivate: [AdminGuard]},
{ path: 'addSign', component: AddSignataireComponent ,canActivate: [AdminGuard]},
{ path: 'editSign/:id', component: EditSignataireComponent ,canActivate: [AdminGuard]},
{ path: 'gestStruct', component: GestStructComponent ,canActivate: [AdminGuard]},
{ path: 'addStruct', component: AddStructComponent ,canActivate: [AdminGuard]},
{ path: 'editStruct/:id', component: EditStructComponent ,canActivate: [AdminGuard]},
{ path: 'gestType', component: GestTypeComponent ,canActivate: [AdminGuard]},
{ path: 'addType', component: AddTypeComponent ,canActivate: [AdminGuard]},
{ path: 'editType/:id', component: EditTypeComponent ,canActivate: [AdminGuard]},
{ path: 'gestTypedemande', component: GestTypeDemandeComponent ,canActivate: [AdminGuard]},
{ path: '**', component: LoginComponent },



];


