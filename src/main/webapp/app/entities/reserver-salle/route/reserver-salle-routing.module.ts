import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ReserverSalleComponent } from '../list/reserver-salle.component';
import { ReserverSalleDetailComponent } from '../detail/reserver-salle-detail.component';
import { ReserverSalleUpdateComponent } from '../update/reserver-salle-update.component';
import { ReserverSalleRoutingResolveService } from './reserver-salle-routing-resolve.service';

const reserverSalleRoute: Routes = [
  {
    path: '',
    component: ReserverSalleComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReserverSalleDetailComponent,
    resolve: {
      reserverSalle: ReserverSalleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReserverSalleUpdateComponent,
    resolve: {
      reserverSalle: ReserverSalleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReserverSalleUpdateComponent,
    resolve: {
      reserverSalle: ReserverSalleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(reserverSalleRoute)],
  exports: [RouterModule],
})
export class ReserverSalleRoutingModule {}
