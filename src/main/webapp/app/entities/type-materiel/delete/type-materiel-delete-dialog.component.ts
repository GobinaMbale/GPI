import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypeMateriel } from '../type-materiel.model';
import { TypeMaterielService } from '../service/type-materiel.service';

@Component({
  templateUrl: './type-materiel-delete-dialog.component.html',
})
export class TypeMaterielDeleteDialogComponent {
  typeMateriel?: ITypeMateriel;

  constructor(protected typeMaterielService: TypeMaterielService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.typeMaterielService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
