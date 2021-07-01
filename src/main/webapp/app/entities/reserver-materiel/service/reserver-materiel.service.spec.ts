import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IReserverMateriel, ReserverMateriel } from '../reserver-materiel.model';

import { ReserverMaterielService } from './reserver-materiel.service';

describe('Service Tests', () => {
  describe('ReserverMateriel Service', () => {
    let service: ReserverMaterielService;
    let httpMock: HttpTestingController;
    let elemDefault: IReserverMateriel;
    let expectedResult: IReserverMateriel | IReserverMateriel[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ReserverMaterielService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        dateReservation: currentDate,
        dateRetour: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dateReservation: currentDate.format(DATE_TIME_FORMAT),
            dateRetour: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a ReserverMateriel', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dateReservation: currentDate.format(DATE_TIME_FORMAT),
            dateRetour: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateReservation: currentDate,
            dateRetour: currentDate,
          },
          returnedFromService
        );

        service.create(new ReserverMateriel()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ReserverMateriel', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            dateReservation: currentDate.format(DATE_TIME_FORMAT),
            dateRetour: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateReservation: currentDate,
            dateRetour: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a ReserverMateriel', () => {
        const patchObject = Object.assign(
          {
            dateRetour: currentDate.format(DATE_TIME_FORMAT),
          },
          new ReserverMateriel()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            dateReservation: currentDate,
            dateRetour: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ReserverMateriel', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            dateReservation: currentDate.format(DATE_TIME_FORMAT),
            dateRetour: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateReservation: currentDate,
            dateRetour: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a ReserverMateriel', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addReserverMaterielToCollectionIfMissing', () => {
        it('should add a ReserverMateriel to an empty array', () => {
          const reserverMateriel: IReserverMateriel = { id: 123 };
          expectedResult = service.addReserverMaterielToCollectionIfMissing([], reserverMateriel);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(reserverMateriel);
        });

        it('should not add a ReserverMateriel to an array that contains it', () => {
          const reserverMateriel: IReserverMateriel = { id: 123 };
          const reserverMaterielCollection: IReserverMateriel[] = [
            {
              ...reserverMateriel,
            },
            { id: 456 },
          ];
          expectedResult = service.addReserverMaterielToCollectionIfMissing(reserverMaterielCollection, reserverMateriel);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a ReserverMateriel to an array that doesn't contain it", () => {
          const reserverMateriel: IReserverMateriel = { id: 123 };
          const reserverMaterielCollection: IReserverMateriel[] = [{ id: 456 }];
          expectedResult = service.addReserverMaterielToCollectionIfMissing(reserverMaterielCollection, reserverMateriel);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(reserverMateriel);
        });

        it('should add only unique ReserverMateriel to an array', () => {
          const reserverMaterielArray: IReserverMateriel[] = [{ id: 123 }, { id: 456 }, { id: 372 }];
          const reserverMaterielCollection: IReserverMateriel[] = [{ id: 123 }];
          expectedResult = service.addReserverMaterielToCollectionIfMissing(reserverMaterielCollection, ...reserverMaterielArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const reserverMateriel: IReserverMateriel = { id: 123 };
          const reserverMateriel2: IReserverMateriel = { id: 456 };
          expectedResult = service.addReserverMaterielToCollectionIfMissing([], reserverMateriel, reserverMateriel2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(reserverMateriel);
          expect(expectedResult).toContain(reserverMateriel2);
        });

        it('should accept null and undefined values', () => {
          const reserverMateriel: IReserverMateriel = { id: 123 };
          expectedResult = service.addReserverMaterielToCollectionIfMissing([], null, reserverMateriel, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(reserverMateriel);
        });

        it('should return initial array if no ReserverMateriel is added', () => {
          const reserverMaterielCollection: IReserverMateriel[] = [{ id: 123 }];
          expectedResult = service.addReserverMaterielToCollectionIfMissing(reserverMaterielCollection, undefined, null);
          expect(expectedResult).toEqual(reserverMaterielCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
