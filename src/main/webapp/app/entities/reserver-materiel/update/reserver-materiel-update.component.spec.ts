jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ReserverMaterielService } from '../service/reserver-materiel.service';
import { IReserverMateriel, ReserverMateriel } from '../reserver-materiel.model';
import { IUserMgr } from 'app/entities/user-mgr/user-mgr.model';
import { UserMgrService } from 'app/entities/user-mgr/service/user-mgr.service';
import { IMateriel } from 'app/entities/materiel/materiel.model';
import { MaterielService } from 'app/entities/materiel/service/materiel.service';

import { ReserverMaterielUpdateComponent } from './reserver-materiel-update.component';

describe('Component Tests', () => {
  describe('ReserverMateriel Management Update Component', () => {
    let comp: ReserverMaterielUpdateComponent;
    let fixture: ComponentFixture<ReserverMaterielUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let reserverMaterielService: ReserverMaterielService;
    let userMgrService: UserMgrService;
    let materielService: MaterielService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ReserverMaterielUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ReserverMaterielUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ReserverMaterielUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      reserverMaterielService = TestBed.inject(ReserverMaterielService);
      userMgrService = TestBed.inject(UserMgrService);
      materielService = TestBed.inject(MaterielService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call UserMgr query and add missing value', () => {
        const reserverMateriel: IReserverMateriel = { id: 456 };
        const auteur: IUserMgr = { id: 2935 };
        reserverMateriel.auteur = auteur;

        const userMgrCollection: IUserMgr[] = [{ id: 75314 }];
        jest.spyOn(userMgrService, 'query').mockReturnValue(of(new HttpResponse({ body: userMgrCollection })));
        const additionalUserMgrs = [auteur];
        const expectedCollection: IUserMgr[] = [...additionalUserMgrs, ...userMgrCollection];
        jest.spyOn(userMgrService, 'addUserMgrToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ reserverMateriel });
        comp.ngOnInit();

        expect(userMgrService.query).toHaveBeenCalled();
        expect(userMgrService.addUserMgrToCollectionIfMissing).toHaveBeenCalledWith(userMgrCollection, ...additionalUserMgrs);
        expect(comp.userMgrsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Materiel query and add missing value', () => {
        const reserverMateriel: IReserverMateriel = { id: 456 };
        const materiel: IMateriel = { id: 48092 };
        reserverMateriel.materiel = materiel;

        const materielCollection: IMateriel[] = [{ id: 82837 }];
        jest.spyOn(materielService, 'query').mockReturnValue(of(new HttpResponse({ body: materielCollection })));
        const additionalMateriels = [materiel];
        const expectedCollection: IMateriel[] = [...additionalMateriels, ...materielCollection];
        jest.spyOn(materielService, 'addMaterielToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ reserverMateriel });
        comp.ngOnInit();

        expect(materielService.query).toHaveBeenCalled();
        expect(materielService.addMaterielToCollectionIfMissing).toHaveBeenCalledWith(materielCollection, ...additionalMateriels);
        expect(comp.materielsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const reserverMateriel: IReserverMateriel = { id: 456 };
        const auteur: IUserMgr = { id: 72363 };
        reserverMateriel.auteur = auteur;
        const materiel: IMateriel = { id: 20445 };
        reserverMateriel.materiel = materiel;

        activatedRoute.data = of({ reserverMateriel });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(reserverMateriel));
        expect(comp.userMgrsSharedCollection).toContain(auteur);
        expect(comp.materielsSharedCollection).toContain(materiel);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ReserverMateriel>>();
        const reserverMateriel = { id: 123 };
        jest.spyOn(reserverMaterielService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ reserverMateriel });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: reserverMateriel }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(reserverMaterielService.update).toHaveBeenCalledWith(reserverMateriel);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ReserverMateriel>>();
        const reserverMateriel = new ReserverMateriel();
        jest.spyOn(reserverMaterielService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ reserverMateriel });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: reserverMateriel }));
        saveSubject.complete();

        // THEN
        expect(reserverMaterielService.create).toHaveBeenCalledWith(reserverMateriel);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ReserverMateriel>>();
        const reserverMateriel = { id: 123 };
        jest.spyOn(reserverMaterielService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ reserverMateriel });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(reserverMaterielService.update).toHaveBeenCalledWith(reserverMateriel);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUserMgrById', () => {
        it('Should return tracked UserMgr primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserMgrById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackMaterielById', () => {
        it('Should return tracked Materiel primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackMaterielById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
