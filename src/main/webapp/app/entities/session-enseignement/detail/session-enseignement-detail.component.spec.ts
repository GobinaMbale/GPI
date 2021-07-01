import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SessionEnseignementDetailComponent } from './session-enseignement-detail.component';

describe('Component Tests', () => {
  describe('SessionEnseignement Management Detail Component', () => {
    let comp: SessionEnseignementDetailComponent;
    let fixture: ComponentFixture<SessionEnseignementDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SessionEnseignementDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ sessionEnseignement: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(SessionEnseignementDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SessionEnseignementDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load sessionEnseignement on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.sessionEnseignement).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
