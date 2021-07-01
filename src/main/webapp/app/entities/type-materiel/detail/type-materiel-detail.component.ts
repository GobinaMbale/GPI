import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITypeMateriel } from '../type-materiel.model';

@Component({
  selector: 'jhi-type-materiel-detail',
  templateUrl: './type-materiel-detail.component.html',
})
export class TypeMaterielDetailComponent implements OnInit {
  typeMateriel: ITypeMateriel | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeMateriel }) => {
      this.typeMateriel = typeMateriel;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
