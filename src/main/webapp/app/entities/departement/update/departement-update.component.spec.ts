jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { DepartementService } from '../service/departement.service';
import { IDepartement, Departement } from '../departement.model';

import { DepartementUpdateComponent } from './departement-update.component';

describe('Component Tests', () => {
  describe('Departement Management Update Component', () => {
    let comp: DepartementUpdateComponent;
    let fixture: ComponentFixture<DepartementUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let departementService: DepartementService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DepartementUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(DepartementUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DepartementUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      departementService = TestBed.inject(DepartementService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const departement: IDepartement = { id: 456 };

        activatedRoute.data = of({ departement });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(departement));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Departement>>();
        const departement = { id: 123 };
        jest.spyOn(departementService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ departement });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: departement }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(departementService.update).toHaveBeenCalledWith(departement);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Departement>>();
        const departement = new Departement();
        jest.spyOn(departementService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ departement });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: departement }));
        saveSubject.complete();

        // THEN
        expect(departementService.create).toHaveBeenCalledWith(departement);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Departement>>();
        const departement = { id: 123 };
        jest.spyOn(departementService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ departement });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(departementService.update).toHaveBeenCalledWith(departement);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
