jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EnseignerService } from '../service/enseigner.service';
import { IEnseigner, Enseigner } from '../enseigner.model';
import { IMatiere } from 'app/entities/matiere/matiere.model';
import { MatiereService } from 'app/entities/matiere/service/matiere.service';
import { IUserMgr } from 'app/entities/user-mgr/user-mgr.model';
import { UserMgrService } from 'app/entities/user-mgr/service/user-mgr.service';

import { EnseignerUpdateComponent } from './enseigner-update.component';

describe('Component Tests', () => {
  describe('Enseigner Management Update Component', () => {
    let comp: EnseignerUpdateComponent;
    let fixture: ComponentFixture<EnseignerUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let enseignerService: EnseignerService;
    let matiereService: MatiereService;
    let userMgrService: UserMgrService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EnseignerUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(EnseignerUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EnseignerUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      enseignerService = TestBed.inject(EnseignerService);
      matiereService = TestBed.inject(MatiereService);
      userMgrService = TestBed.inject(UserMgrService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Matiere query and add missing value', () => {
        const enseigner: IEnseigner = { id: 456 };
        const matiere: IMatiere = { id: 21363 };
        enseigner.matiere = matiere;

        const matiereCollection: IMatiere[] = [{ id: 2552 }];
        jest.spyOn(matiereService, 'query').mockReturnValue(of(new HttpResponse({ body: matiereCollection })));
        const additionalMatieres = [matiere];
        const expectedCollection: IMatiere[] = [...additionalMatieres, ...matiereCollection];
        jest.spyOn(matiereService, 'addMatiereToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ enseigner });
        comp.ngOnInit();

        expect(matiereService.query).toHaveBeenCalled();
        expect(matiereService.addMatiereToCollectionIfMissing).toHaveBeenCalledWith(matiereCollection, ...additionalMatieres);
        expect(comp.matieresSharedCollection).toEqual(expectedCollection);
      });

      it('Should call UserMgr query and add missing value', () => {
        const enseigner: IEnseigner = { id: 456 };
        const enseignant: IUserMgr = { id: 1068 };
        enseigner.enseignant = enseignant;

        const userMgrCollection: IUserMgr[] = [{ id: 50513 }];
        jest.spyOn(userMgrService, 'query').mockReturnValue(of(new HttpResponse({ body: userMgrCollection })));
        const additionalUserMgrs = [enseignant];
        const expectedCollection: IUserMgr[] = [...additionalUserMgrs, ...userMgrCollection];
        jest.spyOn(userMgrService, 'addUserMgrToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ enseigner });
        comp.ngOnInit();

        expect(userMgrService.query).toHaveBeenCalled();
        expect(userMgrService.addUserMgrToCollectionIfMissing).toHaveBeenCalledWith(userMgrCollection, ...additionalUserMgrs);
        expect(comp.userMgrsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const enseigner: IEnseigner = { id: 456 };
        const matiere: IMatiere = { id: 43025 };
        enseigner.matiere = matiere;
        const enseignant: IUserMgr = { id: 87333 };
        enseigner.enseignant = enseignant;

        activatedRoute.data = of({ enseigner });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(enseigner));
        expect(comp.matieresSharedCollection).toContain(matiere);
        expect(comp.userMgrsSharedCollection).toContain(enseignant);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Enseigner>>();
        const enseigner = { id: 123 };
        jest.spyOn(enseignerService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ enseigner });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: enseigner }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(enseignerService.update).toHaveBeenCalledWith(enseigner);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Enseigner>>();
        const enseigner = new Enseigner();
        jest.spyOn(enseignerService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ enseigner });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: enseigner }));
        saveSubject.complete();

        // THEN
        expect(enseignerService.create).toHaveBeenCalledWith(enseigner);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Enseigner>>();
        const enseigner = { id: 123 };
        jest.spyOn(enseignerService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ enseigner });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(enseignerService.update).toHaveBeenCalledWith(enseigner);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackMatiereById', () => {
        it('Should return tracked Matiere primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackMatiereById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackUserMgrById', () => {
        it('Should return tracked UserMgr primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserMgrById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
