import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MaterielComponent } from '../list/materiel.component';
import { MaterielDetailComponent } from '../detail/materiel-detail.component';
import { MaterielUpdateComponent } from '../update/materiel-update.component';
import { MaterielRoutingResolveService } from './materiel-routing-resolve.service';
import { ReserverMaterielUpdate2Component } from '../../reserver-materiel/update/reserver-materiel-update-2.component';
import { ReserverMaterielRoutingResolve2Service } from '../../reserver-materiel/route/reserver-materiel-routing-resolve-2.service';

const materielRoute: Routes = [
  {
    path: '',
    component: MaterielComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MaterielDetailComponent,
    resolve: {
      materiel: MaterielRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MaterielUpdateComponent,
    resolve: {
      materiel: MaterielRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MaterielUpdateComponent,
    resolve: {
      materiel: MaterielRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/reserver-materiel',
    component: ReserverMaterielUpdate2Component,
    resolve: {
      profil: ReserverMaterielRoutingResolve2Service,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(materielRoute)],
  exports: [RouterModule],
})
export class MaterielRoutingModule {}
