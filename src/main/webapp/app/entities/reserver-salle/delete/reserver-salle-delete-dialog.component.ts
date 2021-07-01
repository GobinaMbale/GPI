import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IReserverSalle } from '../reserver-salle.model';
import { ReserverSalleService } from '../service/reserver-salle.service';

@Component({
  templateUrl: './reserver-salle-delete-dialog.component.html',
})
export class ReserverSalleDeleteDialogComponent {
  reserverSalle?: IReserverSalle;

  constructor(protected reserverSalleService: ReserverSalleService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.reserverSalleService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
