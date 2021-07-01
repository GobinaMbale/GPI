import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TypeMaterielComponent } from '../list/type-materiel.component';
import { TypeMaterielDetailComponent } from '../detail/type-materiel-detail.component';
import { TypeMaterielUpdateComponent } from '../update/type-materiel-update.component';
import { TypeMaterielRoutingResolveService } from './type-materiel-routing-resolve.service';

const typeMaterielRoute: Routes = [
  {
    path: '',
    component: TypeMaterielComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TypeMaterielDetailComponent,
    resolve: {
      typeMateriel: TypeMaterielRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TypeMaterielUpdateComponent,
    resolve: {
      typeMateriel: TypeMaterielRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TypeMaterielUpdateComponent,
    resolve: {
      typeMateriel: TypeMaterielRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(typeMaterielRoute)],
  exports: [RouterModule],
})
export class TypeMaterielRoutingModule {}
