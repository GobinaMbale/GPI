jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { EnseignerService } from '../service/enseigner.service';

import { EnseignerDeleteDialogComponent } from './enseigner-delete-dialog.component';

describe('Component Tests', () => {
  describe('Enseigner Management Delete Component', () => {
    let comp: EnseignerDeleteDialogComponent;
    let fixture: ComponentFixture<EnseignerDeleteDialogComponent>;
    let service: EnseignerService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EnseignerDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(EnseignerDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EnseignerDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(EnseignerService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({})));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        jest.spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
