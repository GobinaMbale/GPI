import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IUserMgr, UserMgr } from '../user-mgr.model';
import { UserMgrService } from '../service/user-mgr.service';
import { IDepartement } from 'app/entities/departement/departement.model';
import { DepartementService } from 'app/entities/departement/service/departement.service';
import { IGrade } from 'app/entities/grade/grade.model';
import { GradeService } from 'app/entities/grade/service/grade.service';

@Component({
  selector: 'jhi-user-mgr-update',
  templateUrl: './user-mgr-update.component.html',
})
export class UserMgrUpdateComponent implements OnInit {
  isSaving = false;

  departementsSharedCollection: IDepartement[] = [];
  gradesSharedCollection: IGrade[] = [];

  editForm = this.fb.group({
    id: [],
    type: [],
    quotaHoraire: [],
    departement: [],
    grade: [],
  });

  constructor(
    protected userMgrService: UserMgrService,
    protected departementService: DepartementService,
    protected gradeService: GradeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userMgr }) => {
      this.updateForm(userMgr);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userMgr = this.createFromForm();
    if (userMgr.id !== undefined) {
      this.subscribeToSaveResponse(this.userMgrService.update(userMgr));
    } else {
      this.subscribeToSaveResponse(this.userMgrService.create(userMgr));
    }
  }

  trackDepartementById(index: number, item: IDepartement): number {
    return item.id!;
  }

  trackGradeById(index: number, item: IGrade): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserMgr>>): void {
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

  protected updateForm(userMgr: IUserMgr): void {
    this.editForm.patchValue({
      id: userMgr.id,
      type: userMgr.type,
      quotaHoraire: userMgr.quotaHoraire,
      departement: userMgr.departement,
      grade: userMgr.grade,
    });

    this.departementsSharedCollection = this.departementService.addDepartementToCollectionIfMissing(
      this.departementsSharedCollection,
      userMgr.departement
    );
    this.gradesSharedCollection = this.gradeService.addGradeToCollectionIfMissing(this.gradesSharedCollection, userMgr.grade);
  }

  protected loadRelationshipsOptions(): void {
    this.departementService
      .query()
      .pipe(map((res: HttpResponse<IDepartement[]>) => res.body ?? []))
      .pipe(
        map((departements: IDepartement[]) =>
          this.departementService.addDepartementToCollectionIfMissing(departements, this.editForm.get('departement')!.value)
        )
      )
      .subscribe((departements: IDepartement[]) => (this.departementsSharedCollection = departements));

    this.gradeService
      .query()
      .pipe(map((res: HttpResponse<IGrade[]>) => res.body ?? []))
      .pipe(map((grades: IGrade[]) => this.gradeService.addGradeToCollectionIfMissing(grades, this.editForm.get('grade')!.value)))
      .subscribe((grades: IGrade[]) => (this.gradesSharedCollection = grades));
  }

  protected createFromForm(): IUserMgr {
    return {
      ...new UserMgr(),
      id: this.editForm.get(['id'])!.value,
      type: this.editForm.get(['type'])!.value,
      quotaHoraire: this.editForm.get(['quotaHoraire'])!.value,
      departement: this.editForm.get(['departement'])!.value,
      grade: this.editForm.get(['grade'])!.value,
    };
  }
}
