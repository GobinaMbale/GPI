import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EnseignerComponent } from './list/enseigner.component';
import { EnseignerDetailComponent } from './detail/enseigner-detail.component';
import { EnseignerUpdateComponent } from './update/enseigner-update.component';
import { EnseignerDeleteDialogComponent } from './delete/enseigner-delete-dialog.component';
import { EnseignerRoutingModule } from './route/enseigner-routing.module';

@NgModule({
  imports: [SharedModule, EnseignerRoutingModule],
  declarations: [EnseignerComponent, EnseignerDetailComponent, EnseignerUpdateComponent, EnseignerDeleteDialogComponent],
  entryComponents: [EnseignerDeleteDialogComponent],
})
export class EnseignerModule {}
