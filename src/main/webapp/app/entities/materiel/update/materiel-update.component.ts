import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IMateriel, Materiel } from '../materiel.model';
import { MaterielService } from '../service/materiel.service';
import { ITypeMateriel } from 'app/entities/type-materiel/type-materiel.model';
import { TypeMaterielService } from 'app/entities/type-materiel/service/type-materiel.service';

@Component({
  selector: 'jhi-materiel-update',
  templateUrl: './materiel-update.component.html',
})
export class MaterielUpdateComponent implements OnInit {
  isSaving = false;

  typeMaterielsSharedCollection: ITypeMateriel[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    dateCreation: [null, [Validators.required]],
    etat: [],
    type: [],
  });

  constructor(
    protected materielService: MaterielService,
    protected typeMaterielService: TypeMaterielService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ materiel }) => {
      if (materiel.id === undefined) {
        const today = dayjs().startOf('day');
        materiel.dateCreation = today;
      }

      this.updateForm(materiel);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const materiel = this.createFromForm();
    if (materiel.id !== undefined) {
      this.subscribeToSaveResponse(this.materielService.update(materiel));
    } else {
      this.subscribeToSaveResponse(this.materielService.create(materiel));
    }
  }

  trackTypeMaterielById(index: number, item: ITypeMateriel): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMateriel>>): void {
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

  protected updateForm(materiel: IMateriel): void {
    this.editForm.patchValue({
      id: materiel.id,
      nom: materiel.nom,
      dateCreation: materiel.dateCreation ? materiel.dateCreation.format(DATE_TIME_FORMAT) : null,
      etat: materiel.etat,
      type: materiel.type,
    });

    this.typeMaterielsSharedCollection = this.typeMaterielService.addTypeMaterielToCollectionIfMissing(
      this.typeMaterielsSharedCollection,
      materiel.type
    );
  }

  protected loadRelationshipsOptions(): void {
    this.typeMaterielService
      .query()
      .pipe(map((res: HttpResponse<ITypeMateriel[]>) => res.body ?? []))
      .pipe(
        map((typeMateriels: ITypeMateriel[]) =>
          this.typeMaterielService.addTypeMaterielToCollectionIfMissing(typeMateriels, this.editForm.get('type')!.value)
        )
      )
      .subscribe((typeMateriels: ITypeMateriel[]) => (this.typeMaterielsSharedCollection = typeMateriels));
  }

  protected createFromForm(): IMateriel {
    return {
      ...new Materiel(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      dateCreation: this.editForm.get(['dateCreation'])!.value
        ? dayjs(this.editForm.get(['dateCreation'])!.value, DATE_TIME_FORMAT)
        : undefined,
      etat: this.editForm.get(['etat'])!.value,
      type: this.editForm.get(['type'])!.value,
    };
  }
}
