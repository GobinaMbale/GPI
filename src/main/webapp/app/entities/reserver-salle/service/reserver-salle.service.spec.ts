import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IReserverSalle, ReserverSalle } from '../reserver-salle.model';

import { ReserverSalleService } from './reserver-salle.service';

describe('Service Tests', () => {
  describe('ReserverSalle Service', () => {
    let service: ReserverSalleService;
    let httpMock: HttpTestingController;
    let elemDefault: IReserverSalle;
    let expectedResult: IReserverSalle | IReserverSalle[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ReserverSalleService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        dateReservation: currentDate,
        motif: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dateReservation: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a ReserverSalle', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dateReservation: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateReservation: currentDate,
          },
          returnedFromService
        );

        service.create(new ReserverSalle()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ReserverSalle', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            dateReservation: currentDate.format(DATE_TIME_FORMAT),
            motif: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateReservation: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a ReserverSalle', () => {
        const patchObject = Object.assign(
          {
            dateReservation: currentDate.format(DATE_TIME_FORMAT),
          },
          new ReserverSalle()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            dateReservation: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ReserverSalle', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            dateReservation: currentDate.format(DATE_TIME_FORMAT),
            motif: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateReservation: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a ReserverSalle', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addReserverSalleToCollectionIfMissing', () => {
        it('should add a ReserverSalle to an empty array', () => {
          const reserverSalle: IReserverSalle = { id: 123 };
          expectedResult = service.addReserverSalleToCollectionIfMissing([], reserverSalle);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(reserverSalle);
        });

        it('should not add a ReserverSalle to an array that contains it', () => {
          const reserverSalle: IReserverSalle = { id: 123 };
          const reserverSalleCollection: IReserverSalle[] = [
            {
              ...reserverSalle,
            },
            { id: 456 },
          ];
          expectedResult = service.addReserverSalleToCollectionIfMissing(reserverSalleCollection, reserverSalle);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a ReserverSalle to an array that doesn't contain it", () => {
          const reserverSalle: IReserverSalle = { id: 123 };
          const reserverSalleCollection: IReserverSalle[] = [{ id: 456 }];
          expectedResult = service.addReserverSalleToCollectionIfMissing(reserverSalleCollection, reserverSalle);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(reserverSalle);
        });

        it('should add only unique ReserverSalle to an array', () => {
          const reserverSalleArray: IReserverSalle[] = [{ id: 123 }, { id: 456 }, { id: 10165 }];
          const reserverSalleCollection: IReserverSalle[] = [{ id: 123 }];
          expectedResult = service.addReserverSalleToCollectionIfMissing(reserverSalleCollection, ...reserverSalleArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const reserverSalle: IReserverSalle = { id: 123 };
          const reserverSalle2: IReserverSalle = { id: 456 };
          expectedResult = service.addReserverSalleToCollectionIfMissing([], reserverSalle, reserverSalle2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(reserverSalle);
          expect(expectedResult).toContain(reserverSalle2);
        });

        it('should accept null and undefined values', () => {
          const reserverSalle: IReserverSalle = { id: 123 };
          expectedResult = service.addReserverSalleToCollectionIfMissing([], null, reserverSalle, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(reserverSalle);
        });

        it('should return initial array if no ReserverSalle is added', () => {
          const reserverSalleCollection: IReserverSalle[] = [{ id: 123 }];
          expectedResult = service.addReserverSalleToCollectionIfMissing(reserverSalleCollection, undefined, null);
          expect(expectedResult).toEqual(reserverSalleCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
