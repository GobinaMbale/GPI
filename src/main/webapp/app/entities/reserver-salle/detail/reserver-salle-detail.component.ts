import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IReserverSalle } from '../reserver-salle.model';

@Component({
  selector: 'jhi-reserver-salle-detail',
  templateUrl: './reserver-salle-detail.component.html',
})
export class ReserverSalleDetailComponent implements OnInit {
  reserverSalle: IReserverSalle | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reserverSalle }) => {
      this.reserverSalle = reserverSalle;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
