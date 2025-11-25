import { Routes } from '@angular/router';
import { HomePage } from './components/home-page/home-page';
import { WatchListPage } from './components/watch-list-page/watch-list-page';
import { DetailsPage } from './components/details-page/details-page';
import { LoginPage } from './components/login-page/login-page';
import { RegisterPage } from './components/register-page/register-page';
import { SettingPage } from './components/setting-page/setting-page';
import { NotFound } from './components/not-found/not-found';

export const routes: Routes = [
{ path: '', redirectTo: 'home', pathMatch: 'full' },
{ path: 'home', component: HomePage ,'title':'Home' },
{ path: 'wishlist', component:WatchListPage ,'title':'Watch List' },
{ path: 'details/:id', component: DetailsPage ,'title':'Details' },
{ path: 'login', component: LoginPage ,'title':'Login' },
{ path: 'register', component: RegisterPage ,'title':'Register' },
{ path: 'setting', component: SettingPage ,'title':'Setting' },
{ path: '**', component: NotFound ,'title':'Error' }
];
