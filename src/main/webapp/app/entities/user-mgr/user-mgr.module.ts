import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserMgrComponent } from './list/user-mgr.component';
import { UserMgrDetailComponent } from './detail/user-mgr-detail.component';
import { UserMgrUpdateComponent } from './update/user-mgr-update.component';
import { UserMgrDeleteDialogComponent } from './delete/user-mgr-delete-dialog.component';
import { UserMgrRoutingModule } from './route/user-mgr-routing.module';

@NgModule({
  imports: [SharedModule, UserMgrRoutingModule],
  declarations: [UserMgrComponent, UserMgrDetailComponent, UserMgrUpdateComponent, UserMgrDeleteDialogComponent],
  entryComponents: [UserMgrDeleteDialogComponent],
})
export class UserMgrModule {}
