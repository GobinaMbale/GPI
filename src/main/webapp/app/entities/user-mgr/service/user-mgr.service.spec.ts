import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TypeEnseignant } from 'app/entities/enumerations/type-enseignant.model';
import { IUserMgr, UserMgr } from '../user-mgr.model';

import { UserMgrService } from './user-mgr.service';

describe('Service Tests', () => {
  describe('UserMgr Service', () => {
    let service: UserMgrService;
    let httpMock: HttpTestingController;
    let elemDefault: IUserMgr;
    let expectedResult: IUserMgr | IUserMgr[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(UserMgrService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        type: TypeEnseignant.PERMANENT,
        quotaHoraire: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a UserMgr', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new UserMgr()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a UserMgr', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            type: 'BBBBBB',
            quotaHoraire: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a UserMgr', () => {
        const patchObject = Object.assign({}, new UserMgr());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of UserMgr', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            type: 'BBBBBB',
            quotaHoraire: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a UserMgr', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addUserMgrToCollectionIfMissing', () => {
        it('should add a UserMgr to an empty array', () => {
          const userMgr: IUserMgr = { id: 123 };
          expectedResult = service.addUserMgrToCollectionIfMissing([], userMgr);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(userMgr);
        });

        it('should not add a UserMgr to an array that contains it', () => {
          const userMgr: IUserMgr = { id: 123 };
          const userMgrCollection: IUserMgr[] = [
            {
              ...userMgr,
            },
            { id: 456 },
          ];
          expectedResult = service.addUserMgrToCollectionIfMissing(userMgrCollection, userMgr);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a UserMgr to an array that doesn't contain it", () => {
          const userMgr: IUserMgr = { id: 123 };
          const userMgrCollection: IUserMgr[] = [{ id: 456 }];
          expectedResult = service.addUserMgrToCollectionIfMissing(userMgrCollection, userMgr);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(userMgr);
        });

        it('should add only unique UserMgr to an array', () => {
          const userMgrArray: IUserMgr[] = [{ id: 123 }, { id: 456 }, { id: 48268 }];
          const userMgrCollection: IUserMgr[] = [{ id: 123 }];
          expectedResult = service.addUserMgrToCollectionIfMissing(userMgrCollection, ...userMgrArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const userMgr: IUserMgr = { id: 123 };
          const userMgr2: IUserMgr = { id: 456 };
          expectedResult = service.addUserMgrToCollectionIfMissing([], userMgr, userMgr2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(userMgr);
          expect(expectedResult).toContain(userMgr2);
        });

        it('should accept null and undefined values', () => {
          const userMgr: IUserMgr = { id: 123 };
          expectedResult = service.addUserMgrToCollectionIfMissing([], null, userMgr, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(userMgr);
        });

        it('should return initial array if no UserMgr is added', () => {
          const userMgrCollection: IUserMgr[] = [{ id: 123 }];
          expectedResult = service.addUserMgrToCollectionIfMissing(userMgrCollection, undefined, null);
          expect(expectedResult).toEqual(userMgrCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
