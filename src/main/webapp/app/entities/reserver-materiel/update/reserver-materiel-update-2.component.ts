import { Component, OnInit } from '@angular/core';
import { IUserMgr } from '../../user-mgr/user-mgr.model';
import { IMateriel, Materiel } from '../../materiel/materiel.model';
import { ReserverMaterielService } from '../service/reserver-materiel.service';
import { UserMgrService } from '../../user-mgr/service/user-mgr.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { finalize, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { IReserverMateriel, ReserverMateriel } from '../reserver-materiel.model';
import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from '../../../config/input.constants';
import { Observable } from 'rxjs';

@Component({
  selector: 'jhi-reserver-materiel-update-2',
  templateUrl: './reserver-materiel-update-2.component.html',
})
export class ReserverMaterielUpdate2Component implements OnInit {
  isSaving = false;

  userMgrsSharedCollection: IUserMgr[] = [];
  materielsSharedCollection: Materiel = new Materiel();

  editForm = this.fb.group({
    id: [],
    dateReservation: [],
    dateRetour: [],
    auteur: [],
    materiel: [],
  });

  constructor(
    private reserverMaterielService: ReserverMaterielService,
    private userMgrService: UserMgrService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ profil }) => {
      this.materielsSharedCollection = profil;
    });
    this.loadRelationshipsOptions();
  }

  public previousState(): void {
    window.history.back();
  }

  public save(): void {
    this.isSaving = true;
    const reserverMateriel = this.createFromForm();
    if (reserverMateriel.id !== undefined) {
      this.subscribeToSaveResponse(this.reserverMaterielService.update(reserverMateriel));
    } else {
      this.subscribeToSaveResponse(this.reserverMaterielService.create(reserverMateriel));
    }
  }

  public trackUserMgrById(index: number, item: IUserMgr): number {
    return item.id!;
  }

  public trackMaterielById(index: number, item: IMateriel): number {
    return item.id!;
  }

  public subscribeToSaveResponse(result: Observable<HttpResponse<IReserverMateriel>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  public onSaveSuccess(): void {
    this.previousState();
  }

  public onSaveError(): void {
    // Api for inheritance.
  }

  public onSaveFinalize(): void {
    this.isSaving = false;
  }

  public loadRelationshipsOptions(): void {
    this.userMgrService
      .query()
      .pipe(map((res: HttpResponse<IUserMgr[]>) => res.body ?? []))
      .pipe(
        map((userMgrs: IUserMgr[]) => this.userMgrService.addUserMgrToCollectionIfMissing(userMgrs, this.editForm.get('auteur')!.value))
      )
      .subscribe((userMgrs: IUserMgr[]) => (this.userMgrsSharedCollection = userMgrs));
  }

  public createFromForm(): IReserverMateriel {
    return {
      ...new ReserverMateriel(),
      id: this.editForm.get(['id'])!.value,
      dateReservation: this.editForm.get(['dateReservation'])!.value
        ? dayjs(this.editForm.get(['dateReservation'])!.value, DATE_TIME_FORMAT)
        : undefined,
      dateRetour: this.editForm.get(['dateRetour'])!.value ? dayjs(this.editForm.get(['dateRetour'])!.value, DATE_TIME_FORMAT) : undefined,
      auteur: this.editForm.get(['auteur'])!.value,
      materiel: this.materielsSharedCollection,
    };
  }

  public updateForm(reserverMateriel: IReserverMateriel): void {
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
  }
}
