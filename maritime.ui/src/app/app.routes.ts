import {Routes} from '@angular/router';
import {LayoutComponent} from './pages/layout/layout.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {ShipComponent} from './pages/ship/ship.component';
import {PortComponent} from './pages/port/port.component';
import {VoyageComponent} from './pages/voyage/voyage.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {CountryComponent} from './pages/country/country.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'ships',
        component: ShipComponent,
      },
      {
        path: 'voyages',
        component: VoyageComponent,
      },
      {
        path: 'ports',
        component: PortComponent,
      },
      {
        path: 'countries',
        component: CountryComponent,
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
