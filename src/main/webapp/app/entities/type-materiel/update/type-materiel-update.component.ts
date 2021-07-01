import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITypeMateriel, TypeMateriel } from '../type-materiel.model';
import { TypeMaterielService } from '../service/type-materiel.service';

@Component({
  selector: 'jhi-type-materiel-update',
  templateUrl: './type-materiel-update.component.html',
})
export class TypeMaterielUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    libelle: [null, [Validators.required]],
  });

  constructor(protected typeMaterielService: TypeMaterielService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeMateriel }) => {
      this.updateForm(typeMateriel);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const typeMateriel = this.createFromForm();
    if (typeMateriel.id !== undefined) {
      this.subscribeToSaveResponse(this.typeMaterielService.update(typeMateriel));
    } else {
      this.subscribeToSaveResponse(this.typeMaterielService.create(typeMateriel));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITypeMateriel>>): void {
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

  protected updateForm(typeMateriel: ITypeMateriel): void {
    this.editForm.patchValue({
      id: typeMateriel.id,
      libelle: typeMateriel.libelle,
    });
  }

  protected createFromForm(): ITypeMateriel {
    return {
      ...new TypeMateriel(),
      id: this.editForm.get(['id'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
    };
  }
}
