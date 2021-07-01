import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserMgrDetailComponent } from './user-mgr-detail.component';

describe('Component Tests', () => {
  describe('UserMgr Management Detail Component', () => {
    let comp: UserMgrDetailComponent;
    let fixture: ComponentFixture<UserMgrDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [UserMgrDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ userMgr: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(UserMgrDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(UserMgrDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load userMgr on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.userMgr).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
