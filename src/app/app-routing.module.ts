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
import {CodiceSitoGestoriComponent} from "./components/pages-sidebar/codice-sito-gestori/codice-sito-gestori.component";
import {RilevazioniSitoComponent} from "./components/pages-sidebar/rilevazioni-sito/rilevazioni-sito.component";
import {GestoriCemComponent} from "./components/pages-sidebar/gestori-cem/gestori-cem.component";
import {StrumentiCemComponent} from "./components/pages-sidebar/strumenti-cem/strumenti-cem.component";
import {SondestrumComponent} from "./components/pages-sidebar/sondestrum/sondestrum.component";
import {MisureCemComponent} from "./components/pages-sidebar/misure-cem/misure-cem.component";


// { path: 'login', component: LoginComponent, canActivate: [authGuard]},

const routes: Routes = [
  {
    path: '', component: AppLayoutComponent,
    children: [
      {path: 'dashboard', component: DashboardComponent},
      {path: 'protocollocem', component: ProtocolloCemComponent},
      {path: 'protocollogeos', component: ProtocolliGeosComponent},
      {path: 'codicesitogestori', component: CodiceSitoGestoriComponent},
      {path: 'rilevazionisito', component: RilevazioniSitoComponent},
      {path: 'gestori', component: GestoriCemComponent},
      {path: 'strumenticem', component: StrumentiCemComponent},
      {path: 'sondestrum', component: SondestrumComponent},
      {path: 'misurecemrf', component: MisureCemComponent},
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
