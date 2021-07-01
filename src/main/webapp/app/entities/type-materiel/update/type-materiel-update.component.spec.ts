jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TypeMaterielService } from '../service/type-materiel.service';
import { ITypeMateriel, TypeMateriel } from '../type-materiel.model';

import { TypeMaterielUpdateComponent } from './type-materiel-update.component';

describe('Component Tests', () => {
  describe('TypeMateriel Management Update Component', () => {
    let comp: TypeMaterielUpdateComponent;
    let fixture: ComponentFixture<TypeMaterielUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let typeMaterielService: TypeMaterielService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TypeMaterielUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TypeMaterielUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TypeMaterielUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      typeMaterielService = TestBed.inject(TypeMaterielService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const typeMateriel: ITypeMateriel = { id: 456 };

        activatedRoute.data = of({ typeMateriel });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(typeMateriel));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<TypeMateriel>>();
        const typeMateriel = { id: 123 };
        jest.spyOn(typeMaterielService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ typeMateriel });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: typeMateriel }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(typeMaterielService.update).toHaveBeenCalledWith(typeMateriel);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<TypeMateriel>>();
        const typeMateriel = new TypeMateriel();
        jest.spyOn(typeMaterielService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ typeMateriel });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: typeMateriel }));
        saveSubject.complete();

        // THEN
        expect(typeMaterielService.create).toHaveBeenCalledWith(typeMateriel);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<TypeMateriel>>();
        const typeMateriel = { id: 123 };
        jest.spyOn(typeMaterielService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ typeMateriel });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(typeMaterielService.update).toHaveBeenCalledWith(typeMateriel);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
