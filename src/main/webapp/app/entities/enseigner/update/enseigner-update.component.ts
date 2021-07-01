import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IEnseigner, Enseigner } from '../enseigner.model';
import { EnseignerService } from '../service/enseigner.service';
import { IMatiere } from 'app/entities/matiere/matiere.model';
import { MatiereService } from 'app/entities/matiere/service/matiere.service';
import { IUserMgr } from 'app/entities/user-mgr/user-mgr.model';
import { UserMgrService } from 'app/entities/user-mgr/service/user-mgr.service';

@Component({
  selector: 'jhi-enseigner-update',
  templateUrl: './enseigner-update.component.html',
})
export class EnseignerUpdateComponent implements OnInit {
  isSaving = false;

  matieresSharedCollection: IMatiere[] = [];
  userMgrsSharedCollection: IUserMgr[] = [];

  editForm = this.fb.group({
    id: [],
    dateDebut: [null, [Validators.required]],
    dateFin: [null, [Validators.required]],
    matiere: [],
    enseignant: [],
  });

  constructor(
    protected enseignerService: EnseignerService,
    protected matiereService: MatiereService,
    protected userMgrService: UserMgrService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ enseigner }) => {
      if (enseigner.id === undefined) {
        const today = dayjs().startOf('day');
        enseigner.dateDebut = today;
        enseigner.dateFin = today;
      }

      this.updateForm(enseigner);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const enseigner = this.createFromForm();
    if (enseigner.id !== undefined) {
      this.subscribeToSaveResponse(this.enseignerService.update(enseigner));
    } else {
      this.subscribeToSaveResponse(this.enseignerService.create(enseigner));
    }
  }

  trackMatiereById(index: number, item: IMatiere): number {
    return item.id!;
  }

  trackUserMgrById(index: number, item: IUserMgr): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEnseigner>>): void {
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

  protected updateForm(enseigner: IEnseigner): void {
    this.editForm.patchValue({
      id: enseigner.id,
      dateDebut: enseigner.dateDebut ? enseigner.dateDebut.format(DATE_TIME_FORMAT) : null,
      dateFin: enseigner.dateFin ? enseigner.dateFin.format(DATE_TIME_FORMAT) : null,
      matiere: enseigner.matiere,
      enseignant: enseigner.enseignant,
    });

    this.matieresSharedCollection = this.matiereService.addMatiereToCollectionIfMissing(this.matieresSharedCollection, enseigner.matiere);
    this.userMgrsSharedCollection = this.userMgrService.addUserMgrToCollectionIfMissing(
      this.userMgrsSharedCollection,
      enseigner.enseignant
    );
  }

  protected loadRelationshipsOptions(): void {
    this.matiereService
      .query()
      .pipe(map((res: HttpResponse<IMatiere[]>) => res.body ?? []))
      .pipe(
        map((matieres: IMatiere[]) => this.matiereService.addMatiereToCollectionIfMissing(matieres, this.editForm.get('matiere')!.value))
      )
      .subscribe((matieres: IMatiere[]) => (this.matieresSharedCollection = matieres));

    this.userMgrService
      .query()
      .pipe(map((res: HttpResponse<IUserMgr[]>) => res.body ?? []))
      .pipe(
        map((userMgrs: IUserMgr[]) => this.userMgrService.addUserMgrToCollectionIfMissing(userMgrs, this.editForm.get('enseignant')!.value))
      )
      .subscribe((userMgrs: IUserMgr[]) => (this.userMgrsSharedCollection = userMgrs));
  }

  protected createFromForm(): IEnseigner {
    return {
      ...new Enseigner(),
      id: this.editForm.get(['id'])!.value,
      dateDebut: this.editForm.get(['dateDebut'])!.value ? dayjs(this.editForm.get(['dateDebut'])!.value, DATE_TIME_FORMAT) : undefined,
      dateFin: this.editForm.get(['dateFin'])!.value ? dayjs(this.editForm.get(['dateFin'])!.value, DATE_TIME_FORMAT) : undefined,
      matiere: this.editForm.get(['matiere'])!.value,
      enseignant: this.editForm.get(['enseignant'])!.value,
    };
  }
}
