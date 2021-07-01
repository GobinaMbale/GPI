jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { UserMgrService } from '../service/user-mgr.service';
import { IUserMgr, UserMgr } from '../user-mgr.model';
import { IDepartement } from 'app/entities/departement/departement.model';
import { DepartementService } from 'app/entities/departement/service/departement.service';
import { IGrade } from 'app/entities/grade/grade.model';
import { GradeService } from 'app/entities/grade/service/grade.service';

import { UserMgrUpdateComponent } from './user-mgr-update.component';

describe('Component Tests', () => {
  describe('UserMgr Management Update Component', () => {
    let comp: UserMgrUpdateComponent;
    let fixture: ComponentFixture<UserMgrUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let userMgrService: UserMgrService;
    let departementService: DepartementService;
    let gradeService: GradeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [UserMgrUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(UserMgrUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UserMgrUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      userMgrService = TestBed.inject(UserMgrService);
      departementService = TestBed.inject(DepartementService);
      gradeService = TestBed.inject(GradeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Departement query and add missing value', () => {
        const userMgr: IUserMgr = { id: 456 };
        const departement: IDepartement = { id: 55323 };
        userMgr.departement = departement;

        const departementCollection: IDepartement[] = [{ id: 96656 }];
        jest.spyOn(departementService, 'query').mockReturnValue(of(new HttpResponse({ body: departementCollection })));
        const additionalDepartements = [departement];
        const expectedCollection: IDepartement[] = [...additionalDepartements, ...departementCollection];
        jest.spyOn(departementService, 'addDepartementToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ userMgr });
        comp.ngOnInit();

        expect(departementService.query).toHaveBeenCalled();
        expect(departementService.addDepartementToCollectionIfMissing).toHaveBeenCalledWith(
          departementCollection,
          ...additionalDepartements
        );
        expect(comp.departementsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Grade query and add missing value', () => {
        const userMgr: IUserMgr = { id: 456 };
        const grade: IGrade = { id: 52301 };
        userMgr.grade = grade;

        const gradeCollection: IGrade[] = [{ id: 88310 }];
        jest.spyOn(gradeService, 'query').mockReturnValue(of(new HttpResponse({ body: gradeCollection })));
        const additionalGrades = [grade];
        const expectedCollection: IGrade[] = [...additionalGrades, ...gradeCollection];
        jest.spyOn(gradeService, 'addGradeToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ userMgr });
        comp.ngOnInit();

        expect(gradeService.query).toHaveBeenCalled();
        expect(gradeService.addGradeToCollectionIfMissing).toHaveBeenCalledWith(gradeCollection, ...additionalGrades);
        expect(comp.gradesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const userMgr: IUserMgr = { id: 456 };
        const departement: IDepartement = { id: 65624 };
        userMgr.departement = departement;
        const grade: IGrade = { id: 21017 };
        userMgr.grade = grade;

        activatedRoute.data = of({ userMgr });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(userMgr));
        expect(comp.departementsSharedCollection).toContain(departement);
        expect(comp.gradesSharedCollection).toContain(grade);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<UserMgr>>();
        const userMgr = { id: 123 };
        jest.spyOn(userMgrService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ userMgr });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: userMgr }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(userMgrService.update).toHaveBeenCalledWith(userMgr);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<UserMgr>>();
        const userMgr = new UserMgr();
        jest.spyOn(userMgrService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ userMgr });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: userMgr }));
        saveSubject.complete();

        // THEN
        expect(userMgrService.create).toHaveBeenCalledWith(userMgr);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<UserMgr>>();
        const userMgr = { id: 123 };
        jest.spyOn(userMgrService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ userMgr });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(userMgrService.update).toHaveBeenCalledWith(userMgr);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackDepartementById', () => {
        it('Should return tracked Departement primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackDepartementById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackGradeById', () => {
        it('Should return tracked Grade primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackGradeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
