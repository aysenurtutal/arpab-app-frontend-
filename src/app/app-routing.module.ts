import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppLayoutComponent} from "./layout/app.layout.component";
import {LoginComponent} from "./components/login/login.component";
import {AccessComponent} from "./components/auth/access/access.component";
import {ErrorComponent} from "./components/auth/error/error.component";
import {LandingComponent} from "./components/landing/landing.component";
import {NotfoundComponent} from "./components/auth/notfound/notfound.component";
import {ProtocolloCemComponent} from "./components/pages-sidebar/protocollo-cem/protocollo-cem.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {ProtocolliGeosComponent} from "./components/pages-sidebar/protocolli-geos/protocolli-geos.component";


// { path: 'login', component: LoginComponent, canActivate: [authGuard]},

const routes: Routes = [
  {
    path: '', component: AppLayoutComponent,
    children: [
      {path: 'dashboard', component: DashboardComponent},
      {path: 'protocollo', component: ProtocolloCemComponent},
      {path: 'protocollogeos', component: ProtocolliGeosComponent},
    ]
  },
  {path: 'login', component: LoginComponent},
  {path: 'access', component: AccessComponent},
  {path: 'error', component: ErrorComponent},
  {path: 'landing', component: LandingComponent},
  {path: 'notFound', component: NotfoundComponent},

  // { path: '**', redirectTo: '/notfound'},
  {path: '**', redirectTo: 'login'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
