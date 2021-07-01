import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SessionEnseignementComponent } from './list/session-enseignement.component';
import { SessionEnseignementDetailComponent } from './detail/session-enseignement-detail.component';
import { SessionEnseignementUpdateComponent } from './update/session-enseignement-update.component';
import { SessionEnseignementDeleteDialogComponent } from './delete/session-enseignement-delete-dialog.component';
import { SessionEnseignementRoutingModule } from './route/session-enseignement-routing.module';

@NgModule({
  imports: [SharedModule, SessionEnseignementRoutingModule],
  declarations: [
    SessionEnseignementComponent,
    SessionEnseignementDetailComponent,
    SessionEnseignementUpdateComponent,
    SessionEnseignementDeleteDialogComponent,
  ],
  entryComponents: [SessionEnseignementDeleteDialogComponent],
})
export class SessionEnseignementModule {}
