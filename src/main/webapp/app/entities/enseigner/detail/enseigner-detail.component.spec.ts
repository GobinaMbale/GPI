import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EnseignerDetailComponent } from './enseigner-detail.component';

describe('Component Tests', () => {
  describe('Enseigner Management Detail Component', () => {
    let comp: EnseignerDetailComponent;
    let fixture: ComponentFixture<EnseignerDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [EnseignerDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ enseigner: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(EnseignerDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EnseignerDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load enseigner on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.enseigner).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
