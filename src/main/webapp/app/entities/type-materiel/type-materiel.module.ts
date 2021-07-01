import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TypeMaterielComponent } from './list/type-materiel.component';
import { TypeMaterielDetailComponent } from './detail/type-materiel-detail.component';
import { TypeMaterielUpdateComponent } from './update/type-materiel-update.component';
import { TypeMaterielDeleteDialogComponent } from './delete/type-materiel-delete-dialog.component';
import { TypeMaterielRoutingModule } from './route/type-materiel-routing.module';

@NgModule({
  imports: [SharedModule, TypeMaterielRoutingModule],
  declarations: [TypeMaterielComponent, TypeMaterielDetailComponent, TypeMaterielUpdateComponent, TypeMaterielDeleteDialogComponent],
  entryComponents: [TypeMaterielDeleteDialogComponent],
})
export class TypeMaterielModule {}
