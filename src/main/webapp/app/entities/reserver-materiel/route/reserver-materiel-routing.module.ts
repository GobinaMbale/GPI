import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ReserverMaterielComponent } from '../list/reserver-materiel.component';
import { ReserverMaterielDetailComponent } from '../detail/reserver-materiel-detail.component';
import { ReserverMaterielUpdateComponent } from '../update/reserver-materiel-update.component';
import { ReserverMaterielRoutingResolveService } from './reserver-materiel-routing-resolve.service';

const reserverMaterielRoute: Routes = [
  {
    path: '',
    component: ReserverMaterielComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReserverMaterielDetailComponent,
    resolve: {
      reserverMateriel: ReserverMaterielRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReserverMaterielUpdateComponent,
    resolve: {
      reserverMateriel: ReserverMaterielRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReserverMaterielUpdateComponent,
    resolve: {
      reserverMateriel: ReserverMaterielRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(reserverMaterielRoute)],
  exports: [RouterModule],
})
export class ReserverMaterielRoutingModule {}
