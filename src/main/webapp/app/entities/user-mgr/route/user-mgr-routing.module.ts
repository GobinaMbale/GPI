import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserMgrComponent } from '../list/user-mgr.component';
import { UserMgrDetailComponent } from '../detail/user-mgr-detail.component';
import { UserMgrUpdateComponent } from '../update/user-mgr-update.component';
import { UserMgrRoutingResolveService } from './user-mgr-routing-resolve.service';

const userMgrRoute: Routes = [
  {
    path: '',
    component: UserMgrComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserMgrDetailComponent,
    resolve: {
      userMgr: UserMgrRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserMgrUpdateComponent,
    resolve: {
      userMgr: UserMgrRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserMgrUpdateComponent,
    resolve: {
      userMgr: UserMgrRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userMgrRoute)],
  exports: [RouterModule],
})
export class UserMgrRoutingModule {}
