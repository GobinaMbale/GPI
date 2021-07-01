import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SessionEnseignementComponent } from '../list/session-enseignement.component';
import { SessionEnseignementDetailComponent } from '../detail/session-enseignement-detail.component';
import { SessionEnseignementUpdateComponent } from '../update/session-enseignement-update.component';
import { SessionEnseignementRoutingResolveService } from './session-enseignement-routing-resolve.service';

const sessionEnseignementRoute: Routes = [
  {
    path: '',
    component: SessionEnseignementComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SessionEnseignementDetailComponent,
    resolve: {
      sessionEnseignement: SessionEnseignementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SessionEnseignementUpdateComponent,
    resolve: {
      sessionEnseignement: SessionEnseignementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SessionEnseignementUpdateComponent,
    resolve: {
      sessionEnseignement: SessionEnseignementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sessionEnseignementRoute)],
  exports: [RouterModule],
})
export class SessionEnseignementRoutingModule {}
