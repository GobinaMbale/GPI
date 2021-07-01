jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SessionEnseignementService } from '../service/session-enseignement.service';
import { ISessionEnseignement, SessionEnseignement } from '../session-enseignement.model';
import { IEnseigner } from 'app/entities/enseigner/enseigner.model';
import { EnseignerService } from 'app/entities/enseigner/service/enseigner.service';
import { IReserverSalle } from 'app/entities/reserver-salle/reserver-salle.model';
import { ReserverSalleService } from 'app/entities/reserver-salle/service/reserver-salle.service';

import { SessionEnseignementUpdateComponent } from './session-enseignement-update.component';

describe('Component Tests', () => {
  describe('SessionEnseignement Management Update Component', () => {
    let comp: SessionEnseignementUpdateComponent;
    let fixture: ComponentFixture<SessionEnseignementUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let sessionEnseignementService: SessionEnseignementService;
    let enseignerService: EnseignerService;
    let reserverSalleService: ReserverSalleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SessionEnseignementUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SessionEnseignementUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SessionEnseignementUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      sessionEnseignementService = TestBed.inject(SessionEnseignementService);
      enseignerService = TestBed.inject(EnseignerService);
      reserverSalleService = TestBed.inject(ReserverSalleService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Enseigner query and add missing value', () => {
        const sessionEnseignement: ISessionEnseignement = { id: 456 };
        const cours: IEnseigner = { id: 34134 };
        sessionEnseignement.cours = cours;

        const enseignerCollection: IEnseigner[] = [{ id: 24880 }];
        jest.spyOn(enseignerService, 'query').mockReturnValue(of(new HttpResponse({ body: enseignerCollection })));
        const additionalEnseigners = [cours];
        const expectedCollection: IEnseigner[] = [...additionalEnseigners, ...enseignerCollection];
        jest.spyOn(enseignerService, 'addEnseignerToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ sessionEnseignement });
        comp.ngOnInit();

        expect(enseignerService.query).toHaveBeenCalled();
        expect(enseignerService.addEnseignerToCollectionIfMissing).toHaveBeenCalledWith(enseignerCollection, ...additionalEnseigners);
        expect(comp.enseignersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call ReserverSalle query and add missing value', () => {
        const sessionEnseignement: ISessionEnseignement = { id: 456 };
        const salleReserver: IReserverSalle = { id: 10123 };
        sessionEnseignement.salleReserver = salleReserver;

        const reserverSalleCollection: IReserverSalle[] = [{ id: 55658 }];
        jest.spyOn(reserverSalleService, 'query').mockReturnValue(of(new HttpResponse({ body: reserverSalleCollection })));
        const additionalReserverSalles = [salleReserver];
        const expectedCollection: IReserverSalle[] = [...additionalReserverSalles, ...reserverSalleCollection];
        jest.spyOn(reserverSalleService, 'addReserverSalleToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ sessionEnseignement });
        comp.ngOnInit();

        expect(reserverSalleService.query).toHaveBeenCalled();
        expect(reserverSalleService.addReserverSalleToCollectionIfMissing).toHaveBeenCalledWith(
          reserverSalleCollection,
          ...additionalReserverSalles
        );
        expect(comp.reserverSallesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const sessionEnseignement: ISessionEnseignement = { id: 456 };
        const cours: IEnseigner = { id: 80063 };
        sessionEnseignement.cours = cours;
        const salleReserver: IReserverSalle = { id: 94849 };
        sessionEnseignement.salleReserver = salleReserver;

        activatedRoute.data = of({ sessionEnseignement });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(sessionEnseignement));
        expect(comp.enseignersSharedCollection).toContain(cours);
        expect(comp.reserverSallesSharedCollection).toContain(salleReserver);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<SessionEnseignement>>();
        const sessionEnseignement = { id: 123 };
        jest.spyOn(sessionEnseignementService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ sessionEnseignement });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: sessionEnseignement }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(sessionEnseignementService.update).toHaveBeenCalledWith(sessionEnseignement);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<SessionEnseignement>>();
        const sessionEnseignement = new SessionEnseignement();
        jest.spyOn(sessionEnseignementService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ sessionEnseignement });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: sessionEnseignement }));
        saveSubject.complete();

        // THEN
        expect(sessionEnseignementService.create).toHaveBeenCalledWith(sessionEnseignement);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<SessionEnseignement>>();
        const sessionEnseignement = { id: 123 };
        jest.spyOn(sessionEnseignementService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ sessionEnseignement });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(sessionEnseignementService.update).toHaveBeenCalledWith(sessionEnseignement);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackEnseignerById', () => {
        it('Should return tracked Enseigner primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackEnseignerById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackReserverSalleById', () => {
        it('Should return tracked ReserverSalle primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackReserverSalleById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
