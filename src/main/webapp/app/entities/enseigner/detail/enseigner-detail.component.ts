import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEnseigner } from '../enseigner.model';

@Component({
  selector: 'jhi-enseigner-detail',
  templateUrl: './enseigner-detail.component.html',
})
export class EnseignerDetailComponent implements OnInit {
  enseigner: IEnseigner | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ enseigner }) => {
      this.enseigner = enseigner;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
