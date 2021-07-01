import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ReserverSalleComponent } from './list/reserver-salle.component';
import { ReserverSalleDetailComponent } from './detail/reserver-salle-detail.component';
import { ReserverSalleUpdateComponent } from './update/reserver-salle-update.component';
import { ReserverSalleDeleteDialogComponent } from './delete/reserver-salle-delete-dialog.component';
import { ReserverSalleRoutingModule } from './route/reserver-salle-routing.module';

@NgModule({
  imports: [SharedModule, ReserverSalleRoutingModule],
  declarations: [ReserverSalleComponent, ReserverSalleDetailComponent, ReserverSalleUpdateComponent, ReserverSalleDeleteDialogComponent],
  entryComponents: [ReserverSalleDeleteDialogComponent],
})
export class ReserverSalleModule {}
