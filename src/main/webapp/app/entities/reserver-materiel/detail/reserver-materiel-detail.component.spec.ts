import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ReserverMaterielDetailComponent } from './reserver-materiel-detail.component';

describe('Component Tests', () => {
  describe('ReserverMateriel Management Detail Component', () => {
    let comp: ReserverMaterielDetailComponent;
    let fixture: ComponentFixture<ReserverMaterielDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ReserverMaterielDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ reserverMateriel: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ReserverMaterielDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ReserverMaterielDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load reserverMateriel on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.reserverMateriel).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
