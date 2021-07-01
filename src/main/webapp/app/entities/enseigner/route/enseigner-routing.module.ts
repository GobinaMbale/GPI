import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EnseignerComponent } from '../list/enseigner.component';
import { EnseignerDetailComponent } from '../detail/enseigner-detail.component';
import { EnseignerUpdateComponent } from '../update/enseigner-update.component';
import { EnseignerRoutingResolveService } from './enseigner-routing-resolve.service';

const enseignerRoute: Routes = [
  {
    path: '',
    component: EnseignerComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EnseignerDetailComponent,
    resolve: {
      enseigner: EnseignerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EnseignerUpdateComponent,
    resolve: {
      enseigner: EnseignerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EnseignerUpdateComponent,
    resolve: {
      enseigner: EnseignerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(enseignerRoute)],
  exports: [RouterModule],
})
export class EnseignerRoutingModule {}
