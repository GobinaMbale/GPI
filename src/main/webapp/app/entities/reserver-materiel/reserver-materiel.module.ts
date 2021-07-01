import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ReserverMaterielComponent } from './list/reserver-materiel.component';
import { ReserverMaterielDetailComponent } from './detail/reserver-materiel-detail.component';
import { ReserverMaterielUpdateComponent } from './update/reserver-materiel-update.component';
import { ReserverMaterielDeleteDialogComponent } from './delete/reserver-materiel-delete-dialog.component';
import { ReserverMaterielRoutingModule } from './route/reserver-materiel-routing.module';

@NgModule({
  imports: [SharedModule, ReserverMaterielRoutingModule],
  declarations: [
    ReserverMaterielComponent,
    ReserverMaterielDetailComponent,
    ReserverMaterielUpdateComponent,
    ReserverMaterielDeleteDialogComponent,
  ],
  entryComponents: [ReserverMaterielDeleteDialogComponent],
})
export class ReserverMaterielModule {}
