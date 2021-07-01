import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISessionEnseignement } from '../session-enseignement.model';

@Component({
  selector: 'jhi-session-enseignement-detail',
  templateUrl: './session-enseignement-detail.component.html',
})
export class SessionEnseignementDetailComponent implements OnInit {
  sessionEnseignement: ISessionEnseignement | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sessionEnseignement }) => {
      this.sessionEnseignement = sessionEnseignement;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
