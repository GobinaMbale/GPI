import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TypeMaterielDetailComponent } from './type-materiel-detail.component';

describe('Component Tests', () => {
  describe('TypeMateriel Management Detail Component', () => {
    let comp: TypeMaterielDetailComponent;
    let fixture: ComponentFixture<TypeMaterielDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TypeMaterielDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ typeMateriel: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(TypeMaterielDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TypeMaterielDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load typeMateriel on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.typeMateriel).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
