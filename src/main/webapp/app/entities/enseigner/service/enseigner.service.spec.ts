import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEnseigner, Enseigner } from '../enseigner.model';

import { EnseignerService } from './enseigner.service';

describe('Service Tests', () => {
  describe('Enseigner Service', () => {
    let service: EnseignerService;
    let httpMock: HttpTestingController;
    let elemDefault: IEnseigner;
    let expectedResult: IEnseigner | IEnseigner[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(EnseignerService);
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

      it('should create a Enseigner', () => {
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

        service.create(new Enseigner()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Enseigner', () => {
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

      it('should partial update a Enseigner', () => {
        const patchObject = Object.assign({}, new Enseigner());

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

      it('should return a list of Enseigner', () => {
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

      it('should delete a Enseigner', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addEnseignerToCollectionIfMissing', () => {
        it('should add a Enseigner to an empty array', () => {
          const enseigner: IEnseigner = { id: 123 };
          expectedResult = service.addEnseignerToCollectionIfMissing([], enseigner);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(enseigner);
        });

        it('should not add a Enseigner to an array that contains it', () => {
          const enseigner: IEnseigner = { id: 123 };
          const enseignerCollection: IEnseigner[] = [
            {
              ...enseigner,
            },
            { id: 456 },
          ];
          expectedResult = service.addEnseignerToCollectionIfMissing(enseignerCollection, enseigner);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Enseigner to an array that doesn't contain it", () => {
          const enseigner: IEnseigner = { id: 123 };
          const enseignerCollection: IEnseigner[] = [{ id: 456 }];
          expectedResult = service.addEnseignerToCollectionIfMissing(enseignerCollection, enseigner);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(enseigner);
        });

        it('should add only unique Enseigner to an array', () => {
          const enseignerArray: IEnseigner[] = [{ id: 123 }, { id: 456 }, { id: 53758 }];
          const enseignerCollection: IEnseigner[] = [{ id: 123 }];
          expectedResult = service.addEnseignerToCollectionIfMissing(enseignerCollection, ...enseignerArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const enseigner: IEnseigner = { id: 123 };
          const enseigner2: IEnseigner = { id: 456 };
          expectedResult = service.addEnseignerToCollectionIfMissing([], enseigner, enseigner2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(enseigner);
          expect(expectedResult).toContain(enseigner2);
        });

        it('should accept null and undefined values', () => {
          const enseigner: IEnseigner = { id: 123 };
          expectedResult = service.addEnseignerToCollectionIfMissing([], null, enseigner, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(enseigner);
        });

        it('should return initial array if no Enseigner is added', () => {
          const enseignerCollection: IEnseigner[] = [{ id: 123 }];
          expectedResult = service.addEnseignerToCollectionIfMissing(enseignerCollection, undefined, null);
          expect(expectedResult).toEqual(enseignerCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
