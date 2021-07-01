import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ReserverSalleDetailComponent } from './reserver-salle-detail.component';

describe('Component Tests', () => {
  describe('ReserverSalle Management Detail Component', () => {
    let comp: ReserverSalleDetailComponent;
    let fixture: ComponentFixture<ReserverSalleDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ReserverSalleDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ reserverSalle: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ReserverSalleDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ReserverSalleDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load reserverSalle on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.reserverSalle).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
