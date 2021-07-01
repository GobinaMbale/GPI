import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IReserverMateriel, ReserverMateriel } from '../reserver-materiel.model';
import { ReserverMaterielService } from '../service/reserver-materiel.service';
import { IUserMgr } from 'app/entities/user-mgr/user-mgr.model';
import { UserMgrService } from 'app/entities/user-mgr/service/user-mgr.service';
import { IMateriel } from 'app/entities/materiel/materiel.model';
import { MaterielService } from 'app/entities/materiel/service/materiel.service';

@Component({
  selector: 'jhi-reserver-materiel-update',
  templateUrl: './reserver-materiel-update.component.html',
})
export class ReserverMaterielUpdateComponent implements OnInit {
  isSaving = false;

  userMgrsSharedCollection: IUserMgr[] = [];
  materielsSharedCollection: IMateriel[] = [];

  editForm = this.fb.group({
    id: [],
    dateReservation: [],
    dateRetour: [],
    auteur: [],
    materiel: [],
  });

  constructor(
    protected reserverMaterielService: ReserverMaterielService,
    protected userMgrService: UserMgrService,
    protected materielService: MaterielService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reserverMateriel }) => {
      if (reserverMateriel.id === undefined) {
        const today = dayjs().startOf('day');
        reserverMateriel.dateReservation = today;
        reserverMateriel.dateRetour = today;
      }

      this.updateForm(reserverMateriel);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reserverMateriel = this.createFromForm();
    if (reserverMateriel.id !== undefined) {
      this.subscribeToSaveResponse(this.reserverMaterielService.update(reserverMateriel));
    } else {
      this.subscribeToSaveResponse(this.reserverMaterielService.create(reserverMateriel));
    }
  }

  trackUserMgrById(index: number, item: IUserMgr): number {
    return item.id!;
  }

  trackMaterielById(index: number, item: IMateriel): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReserverMateriel>>): void {
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

  protected updateForm(reserverMateriel: IReserverMateriel): void {
    this.editForm.patchValue({
      id: reserverMateriel.id,
      dateReservation: reserverMateriel.dateReservation ? reserverMateriel.dateReservation.format(DATE_TIME_FORMAT) : null,
      dateRetour: reserverMateriel.dateRetour ? reserverMateriel.dateRetour.format(DATE_TIME_FORMAT) : null,
      auteur: reserverMateriel.auteur,
      materiel: reserverMateriel.materiel,
    });

    this.userMgrsSharedCollection = this.userMgrService.addUserMgrToCollectionIfMissing(
      this.userMgrsSharedCollection,
      reserverMateriel.auteur
    );
    this.materielsSharedCollection = this.materielService.addMaterielToCollectionIfMissing(
      this.materielsSharedCollection,
      reserverMateriel.materiel
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userMgrService
      .query()
      .pipe(map((res: HttpResponse<IUserMgr[]>) => res.body ?? []))
      .pipe(
        map((userMgrs: IUserMgr[]) => this.userMgrService.addUserMgrToCollectionIfMissing(userMgrs, this.editForm.get('auteur')!.value))
      )
      .subscribe((userMgrs: IUserMgr[]) => (this.userMgrsSharedCollection = userMgrs));

    this.materielService
      .query()
      .pipe(map((res: HttpResponse<IMateriel[]>) => res.body ?? []))
      .pipe(
        map((materiels: IMateriel[]) =>
          this.materielService.addMaterielToCollectionIfMissing(materiels, this.editForm.get('materiel')!.value)
        )
      )
      .subscribe((materiels: IMateriel[]) => (this.materielsSharedCollection = materiels));
  }

  protected createFromForm(): IReserverMateriel {
    return {
      ...new ReserverMateriel(),
      id: this.editForm.get(['id'])!.value,
      dateReservation: this.editForm.get(['dateReservation'])!.value
        ? dayjs(this.editForm.get(['dateReservation'])!.value, DATE_TIME_FORMAT)
        : undefined,
      dateRetour: this.editForm.get(['dateRetour'])!.value ? dayjs(this.editForm.get(['dateRetour'])!.value, DATE_TIME_FORMAT) : undefined,
      auteur: this.editForm.get(['auteur'])!.value,
      materiel: this.editForm.get(['materiel'])!.value,
    };
  }
}
