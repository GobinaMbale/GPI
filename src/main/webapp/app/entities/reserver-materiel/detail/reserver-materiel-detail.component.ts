import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IReserverMateriel } from '../reserver-materiel.model';

@Component({
  selector: 'jhi-reserver-materiel-detail',
  templateUrl: './reserver-materiel-detail.component.html',
})
export class ReserverMaterielDetailComponent implements OnInit {
  reserverMateriel: IReserverMateriel | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reserverMateriel }) => {
      this.reserverMateriel = reserverMateriel;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
