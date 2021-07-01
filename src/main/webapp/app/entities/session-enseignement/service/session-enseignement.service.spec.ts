import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISessionEnseignement, SessionEnseignement } from '../session-enseignement.model';

import { SessionEnseignementService } from './session-enseignement.service';

describe('Service Tests', () => {
  describe('SessionEnseignement Service', () => {
    let service: SessionEnseignementService;
    let httpMock: HttpTestingController;
    let elemDefault: ISessionEnseignement;
    let expectedResult: ISessionEnseignement | ISessionEnseignement[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SessionEnseignementService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        dateDebut: currentDate,
        dateFin: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dateDebut: currentDate.format(DATE_TIME_FORMAT),
            dateFin: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a SessionEnseignement', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dateDebut: currentDate.format(DATE_TIME_FORMAT),
            dateFin: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateDebut: currentDate,
            dateFin: currentDate,
          },
          returnedFromService
        );

        service.create(new SessionEnseignement()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a SessionEnseignement', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            dateDebut: currentDate.format(DATE_TIME_FORMAT),
            dateFin: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateDebut: currentDate,
            dateFin: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a SessionEnseignement', () => {
        const patchObject = Object.assign(
          {
            dateDebut: currentDate.format(DATE_TIME_FORMAT),
          },
          new SessionEnseignement()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            dateDebut: currentDate,
            dateFin: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of SessionEnseignement', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            dateDebut: currentDate.format(DATE_TIME_FORMAT),
            dateFin: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateDebut: currentDate,
            dateFin: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a SessionEnseignement', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSessionEnseignementToCollectionIfMissing', () => {
        it('should add a SessionEnseignement to an empty array', () => {
          const sessionEnseignement: ISessionEnseignement = { id: 123 };
          expectedResult = service.addSessionEnseignementToCollectionIfMissing([], sessionEnseignement);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(sessionEnseignement);
        });

        it('should not add a SessionEnseignement to an array that contains it', () => {
          const sessionEnseignement: ISessionEnseignement = { id: 123 };
          const sessionEnseignementCollection: ISessionEnseignement[] = [
            {
              ...sessionEnseignement,
            },
            { id: 456 },
          ];
          expectedResult = service.addSessionEnseignementToCollectionIfMissing(sessionEnseignementCollection, sessionEnseignement);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a SessionEnseignement to an array that doesn't contain it", () => {
          const sessionEnseignement: ISessionEnseignement = { id: 123 };
          const sessionEnseignementCollection: ISessionEnseignement[] = [{ id: 456 }];
          expectedResult = service.addSessionEnseignementToCollectionIfMissing(sessionEnseignementCollection, sessionEnseignement);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(sessionEnseignement);
        });

        it('should add only unique SessionEnseignement to an array', () => {
          const sessionEnseignementArray: ISessionEnseignement[] = [{ id: 123 }, { id: 456 }, { id: 91151 }];
          const sessionEnseignementCollection: ISessionEnseignement[] = [{ id: 123 }];
          expectedResult = service.addSessionEnseignementToCollectionIfMissing(sessionEnseignementCollection, ...sessionEnseignementArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const sessionEnseignement: ISessionEnseignement = { id: 123 };
          const sessionEnseignement2: ISessionEnseignement = { id: 456 };
          expectedResult = service.addSessionEnseignementToCollectionIfMissing([], sessionEnseignement, sessionEnseignement2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(sessionEnseignement);
          expect(expectedResult).toContain(sessionEnseignement2);
        });

        it('should accept null and undefined values', () => {
          const sessionEnseignement: ISessionEnseignement = { id: 123 };
          expectedResult = service.addSessionEnseignementToCollectionIfMissing([], null, sessionEnseignement, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(sessionEnseignement);
        });

        it('should return initial array if no SessionEnseignement is added', () => {
          const sessionEnseignementCollection: ISessionEnseignement[] = [{ id: 123 }];
          expectedResult = service.addSessionEnseignementToCollectionIfMissing(sessionEnseignementCollection, undefined, null);
          expect(expectedResult).toEqual(sessionEnseignementCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
