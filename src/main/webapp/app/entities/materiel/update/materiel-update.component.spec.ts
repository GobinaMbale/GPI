jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MaterielService } from '../service/materiel.service';
import { IMateriel, Materiel } from '../materiel.model';
import { ITypeMateriel } from 'app/entities/type-materiel/type-materiel.model';
import { TypeMaterielService } from 'app/entities/type-materiel/service/type-materiel.service';

import { MaterielUpdateComponent } from './materiel-update.component';

describe('Component Tests', () => {
  describe('Materiel Management Update Component', () => {
    let comp: MaterielUpdateComponent;
    let fixture: ComponentFixture<MaterielUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let materielService: MaterielService;
    let typeMaterielService: TypeMaterielService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MaterielUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(MaterielUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MaterielUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      materielService = TestBed.inject(MaterielService);
      typeMaterielService = TestBed.inject(TypeMaterielService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call TypeMateriel query and add missing value', () => {
        const materiel: IMateriel = { id: 456 };
        const type: ITypeMateriel = { id: 51978 };
        materiel.type = type;

        const typeMaterielCollection: ITypeMateriel[] = [{ id: 13010 }];
        jest.spyOn(typeMaterielService, 'query').mockReturnValue(of(new HttpResponse({ body: typeMaterielCollection })));
        const additionalTypeMateriels = [type];
        const expectedCollection: ITypeMateriel[] = [...additionalTypeMateriels, ...typeMaterielCollection];
        jest.spyOn(typeMaterielService, 'addTypeMaterielToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ materiel });
        comp.ngOnInit();

        expect(typeMaterielService.query).toHaveBeenCalled();
        expect(typeMaterielService.addTypeMaterielToCollectionIfMissing).toHaveBeenCalledWith(
          typeMaterielCollection,
          ...additionalTypeMateriels
        );
        expect(comp.typeMaterielsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const materiel: IMateriel = { id: 456 };
        const type: ITypeMateriel = { id: 80573 };
        materiel.type = type;

        activatedRoute.data = of({ materiel });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(materiel));
        expect(comp.typeMaterielsSharedCollection).toContain(type);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Materiel>>();
        const materiel = { id: 123 };
        jest.spyOn(materielService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ materiel });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: materiel }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(materielService.update).toHaveBeenCalledWith(materiel);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Materiel>>();
        const materiel = new Materiel();
        jest.spyOn(materielService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ materiel });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: materiel }));
        saveSubject.complete();

        // THEN
        expect(materielService.create).toHaveBeenCalledWith(materiel);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Materiel>>();
        const materiel = { id: 123 };
        jest.spyOn(materielService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ materiel });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(materielService.update).toHaveBeenCalledWith(materiel);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackTypeMaterielById', () => {
        it('Should return tracked TypeMateriel primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackTypeMaterielById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
