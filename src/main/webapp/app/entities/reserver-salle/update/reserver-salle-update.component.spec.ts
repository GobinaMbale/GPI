jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ReserverSalleService } from '../service/reserver-salle.service';
import { IReserverSalle, ReserverSalle } from '../reserver-salle.model';
import { IClasse } from 'app/entities/classe/classe.model';
import { ClasseService } from 'app/entities/classe/service/classe.service';
import { ISalle } from 'app/entities/salle/salle.model';
import { SalleService } from 'app/entities/salle/service/salle.service';

import { ReserverSalleUpdateComponent } from './reserver-salle-update.component';

describe('Component Tests', () => {
  describe('ReserverSalle Management Update Component', () => {
    let comp: ReserverSalleUpdateComponent;
    let fixture: ComponentFixture<ReserverSalleUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let reserverSalleService: ReserverSalleService;
    let classeService: ClasseService;
    let salleService: SalleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ReserverSalleUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ReserverSalleUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ReserverSalleUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      reserverSalleService = TestBed.inject(ReserverSalleService);
      classeService = TestBed.inject(ClasseService);
      salleService = TestBed.inject(SalleService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Classe query and add missing value', () => {
        const reserverSalle: IReserverSalle = { id: 456 };
        const classe: IClasse = { id: 49297 };
        reserverSalle.classe = classe;

        const classeCollection: IClasse[] = [{ id: 42297 }];
        jest.spyOn(classeService, 'query').mockReturnValue(of(new HttpResponse({ body: classeCollection })));
        const additionalClasses = [classe];
        const expectedCollection: IClasse[] = [...additionalClasses, ...classeCollection];
        jest.spyOn(classeService, 'addClasseToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ reserverSalle });
        comp.ngOnInit();

        expect(classeService.query).toHaveBeenCalled();
        expect(classeService.addClasseToCollectionIfMissing).toHaveBeenCalledWith(classeCollection, ...additionalClasses);
        expect(comp.classesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Salle query and add missing value', () => {
        const reserverSalle: IReserverSalle = { id: 456 };
        const salle: ISalle = { id: 20835 };
        reserverSalle.salle = salle;

        const salleCollection: ISalle[] = [{ id: 64304 }];
        jest.spyOn(salleService, 'query').mockReturnValue(of(new HttpResponse({ body: salleCollection })));
        const additionalSalles = [salle];
        const expectedCollection: ISalle[] = [...additionalSalles, ...salleCollection];
        jest.spyOn(salleService, 'addSalleToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ reserverSalle });
        comp.ngOnInit();

        expect(salleService.query).toHaveBeenCalled();
        expect(salleService.addSalleToCollectionIfMissing).toHaveBeenCalledWith(salleCollection, ...additionalSalles);
        expect(comp.sallesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const reserverSalle: IReserverSalle = { id: 456 };
        const classe: IClasse = { id: 2440 };
        reserverSalle.classe = classe;
        const salle: ISalle = { id: 10432 };
        reserverSalle.salle = salle;

        activatedRoute.data = of({ reserverSalle });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(reserverSalle));
        expect(comp.classesSharedCollection).toContain(classe);
        expect(comp.sallesSharedCollection).toContain(salle);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ReserverSalle>>();
        const reserverSalle = { id: 123 };
        jest.spyOn(reserverSalleService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ reserverSalle });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: reserverSalle }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(reserverSalleService.update).toHaveBeenCalledWith(reserverSalle);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ReserverSalle>>();
        const reserverSalle = new ReserverSalle();
        jest.spyOn(reserverSalleService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ reserverSalle });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: reserverSalle }));
        saveSubject.complete();

        // THEN
        expect(reserverSalleService.create).toHaveBeenCalledWith(reserverSalle);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ReserverSalle>>();
        const reserverSalle = { id: 123 };
        jest.spyOn(reserverSalleService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ reserverSalle });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(reserverSalleService.update).toHaveBeenCalledWith(reserverSalle);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackClasseById', () => {
        it('Should return tracked Classe primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackClasseById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackSalleById', () => {
        it('Should return tracked Salle primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackSalleById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
