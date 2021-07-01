import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ISessionEnseignement, SessionEnseignement } from '../session-enseignement.model';
import { SessionEnseignementService } from '../service/session-enseignement.service';
import { IEnseigner } from 'app/entities/enseigner/enseigner.model';
import { EnseignerService } from 'app/entities/enseigner/service/enseigner.service';
import { IReserverSalle } from 'app/entities/reserver-salle/reserver-salle.model';
import { ReserverSalleService } from 'app/entities/reserver-salle/service/reserver-salle.service';

@Component({
  selector: 'jhi-session-enseignement-update',
  templateUrl: './session-enseignement-update.component.html',
})
export class SessionEnseignementUpdateComponent implements OnInit {
  isSaving = false;

  enseignersSharedCollection: IEnseigner[] = [];
  reserverSallesSharedCollection: IReserverSalle[] = [];

  editForm = this.fb.group({
    id: [],
    dateDebut: [null, [Validators.required]],
    dateFin: [null, [Validators.required]],
    cours: [],
    salleReserver: [],
  });

  constructor(
    protected sessionEnseignementService: SessionEnseignementService,
    protected enseignerService: EnseignerService,
    protected reserverSalleService: ReserverSalleService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sessionEnseignement }) => {
      if (sessionEnseignement.id === undefined) {
        const today = dayjs().startOf('day');
        sessionEnseignement.dateDebut = today;
        sessionEnseignement.dateFin = today;
      }

      this.updateForm(sessionEnseignement);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sessionEnseignement = this.createFromForm();
    if (sessionEnseignement.id !== undefined) {
      this.subscribeToSaveResponse(this.sessionEnseignementService.update(sessionEnseignement));
    } else {
      this.subscribeToSaveResponse(this.sessionEnseignementService.create(sessionEnseignement));
    }
  }

  trackEnseignerById(index: number, item: IEnseigner): number {
    return item.id!;
  }

  trackReserverSalleById(index: number, item: IReserverSalle): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISessionEnseignement>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(sessionEnseignement: ISessionEnseignement): void {
    this.editForm.patchValue({
      id: sessionEnseignement.id,
      dateDebut: sessionEnseignement.dateDebut ? sessionEnseignement.dateDebut.format(DATE_TIME_FORMAT) : null,
      dateFin: sessionEnseignement.dateFin ? sessionEnseignement.dateFin.format(DATE_TIME_FORMAT) : null,
      cours: sessionEnseignement.cours,
      salleReserver: sessionEnseignement.salleReserver,
    });

    this.enseignersSharedCollection = this.enseignerService.addEnseignerToCollectionIfMissing(
      this.enseignersSharedCollection,
      sessionEnseignement.cours
    );
    this.reserverSallesSharedCollection = this.reserverSalleService.addReserverSalleToCollectionIfMissing(
      this.reserverSallesSharedCollection,
      sessionEnseignement.salleReserver
    );
  }

  protected loadRelationshipsOptions(): void {
    this.enseignerService
      .query()
      .pipe(map((res: HttpResponse<IEnseigner[]>) => res.body ?? []))
      .pipe(
        map((enseigners: IEnseigner[]) =>
          this.enseignerService.addEnseignerToCollectionIfMissing(enseigners, this.editForm.get('cours')!.value)
        )
      )
      .subscribe((enseigners: IEnseigner[]) => (this.enseignersSharedCollection = enseigners));

    this.reserverSalleService
      .query()
      .pipe(map((res: HttpResponse<IReserverSalle[]>) => res.body ?? []))
      .pipe(
        map((reserverSalles: IReserverSalle[]) =>
          this.reserverSalleService.addReserverSalleToCollectionIfMissing(reserverSalles, this.editForm.get('salleReserver')!.value)
        )
      )
      .subscribe((reserverSalles: IReserverSalle[]) => (this.reserverSallesSharedCollection = reserverSalles));
  }

  protected createFromForm(): ISessionEnseignement {
    return {
      ...new SessionEnseignement(),
      id: this.editForm.get(['id'])!.value,
      dateDebut: this.editForm.get(['dateDebut'])!.value ? dayjs(this.editForm.get(['dateDebut'])!.value, DATE_TIME_FORMAT) : undefined,
      dateFin: this.editForm.get(['dateFin'])!.value ? dayjs(this.editForm.get(['dateFin'])!.value, DATE_TIME_FORMAT) : undefined,
      cours: this.editForm.get(['cours'])!.value,
      salleReserver: this.editForm.get(['salleReserver'])!.value,
    };
  }
}
