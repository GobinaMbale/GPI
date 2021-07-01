import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IReserverSalle, ReserverSalle } from '../reserver-salle.model';
import { ReserverSalleService } from '../service/reserver-salle.service';
import { IClasse } from 'app/entities/classe/classe.model';
import { ClasseService } from 'app/entities/classe/service/classe.service';
import { ISalle } from 'app/entities/salle/salle.model';
import { SalleService } from 'app/entities/salle/service/salle.service';

@Component({
  selector: 'jhi-reserver-salle-update',
  templateUrl: './reserver-salle-update.component.html',
})
export class ReserverSalleUpdateComponent implements OnInit {
  isSaving = false;

  classesSharedCollection: IClasse[] = [];
  sallesSharedCollection: ISalle[] = [];

  editForm = this.fb.group({
    id: [],
    dateReservation: [null, [Validators.required]],
    motif: [null, [Validators.required]],
    classe: [],
    salle: [],
  });

  constructor(
    protected reserverSalleService: ReserverSalleService,
    protected classeService: ClasseService,
    protected salleService: SalleService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reserverSalle }) => {
      if (reserverSalle.id === undefined) {
        const today = dayjs().startOf('day');
        reserverSalle.dateReservation = today;
      }

      this.updateForm(reserverSalle);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reserverSalle = this.createFromForm();
    if (reserverSalle.id !== undefined) {
      this.subscribeToSaveResponse(this.reserverSalleService.update(reserverSalle));
    } else {
      this.subscribeToSaveResponse(this.reserverSalleService.create(reserverSalle));
    }
  }

  trackClasseById(index: number, item: IClasse): number {
    return item.id!;
  }

  trackSalleById(index: number, item: ISalle): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReserverSalle>>): void {
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

  protected updateForm(reserverSalle: IReserverSalle): void {
    this.editForm.patchValue({
      id: reserverSalle.id,
      dateReservation: reserverSalle.dateReservation ? reserverSalle.dateReservation.format(DATE_TIME_FORMAT) : null,
      motif: reserverSalle.motif,
      classe: reserverSalle.classe,
      salle: reserverSalle.salle,
    });

    this.classesSharedCollection = this.classeService.addClasseToCollectionIfMissing(this.classesSharedCollection, reserverSalle.classe);
    this.sallesSharedCollection = this.salleService.addSalleToCollectionIfMissing(this.sallesSharedCollection, reserverSalle.salle);
  }

  protected loadRelationshipsOptions(): void {
    this.classeService
      .query()
      .pipe(map((res: HttpResponse<IClasse[]>) => res.body ?? []))
      .pipe(map((classes: IClasse[]) => this.classeService.addClasseToCollectionIfMissing(classes, this.editForm.get('classe')!.value)))
      .subscribe((classes: IClasse[]) => (this.classesSharedCollection = classes));

    this.salleService
      .query()
      .pipe(map((res: HttpResponse<ISalle[]>) => res.body ?? []))
      .pipe(map((salles: ISalle[]) => this.salleService.addSalleToCollectionIfMissing(salles, this.editForm.get('salle')!.value)))
      .subscribe((salles: ISalle[]) => (this.sallesSharedCollection = salles));
  }

  protected createFromForm(): IReserverSalle {
    return {
      ...new ReserverSalle(),
      id: this.editForm.get(['id'])!.value,
      dateReservation: this.editForm.get(['dateReservation'])!.value
        ? dayjs(this.editForm.get(['dateReservation'])!.value, DATE_TIME_FORMAT)
        : undefined,
      motif: this.editForm.get(['motif'])!.value,
      classe: this.editForm.get(['classe'])!.value,
      salle: this.editForm.get(['salle'])!.value,
    };
  }
}
