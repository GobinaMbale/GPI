import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IMateriel, Materiel } from '../materiel.model';

import { MaterielService } from './materiel.service';

describe('Service Tests', () => {
  describe('Materiel Service', () => {
    let service: MaterielService;
    let httpMock: HttpTestingController;
    let elemDefault: IMateriel;
    let expectedResult: IMateriel | IMateriel[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(MaterielService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        nom: 'AAAAAAA',
        dateCreation: currentDate,
        etat: false,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dateCreation: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Materiel', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dateCreation: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateCreation: currentDate,
          },
          returnedFromService
        );

        service.create(new Materiel()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Materiel', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nom: 'BBBBBB',
            dateCreation: currentDate.format(DATE_TIME_FORMAT),
            etat: true,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateCreation: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Materiel', () => {
        const patchObject = Object.assign(
          {
            dateCreation: currentDate.format(DATE_TIME_FORMAT),
          },
          new Materiel()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            dateCreation: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Materiel', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nom: 'BBBBBB',
            dateCreation: currentDate.format(DATE_TIME_FORMAT),
            etat: true,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateCreation: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Materiel', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addMaterielToCollectionIfMissing', () => {
        it('should add a Materiel to an empty array', () => {
          const materiel: IMateriel = { id: 123 };
          expectedResult = service.addMaterielToCollectionIfMissing([], materiel);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(materiel);
        });

        it('should not add a Materiel to an array that contains it', () => {
          const materiel: IMateriel = { id: 123 };
          const materielCollection: IMateriel[] = [
            {
              ...materiel,
            },
            { id: 456 },
          ];
          expectedResult = service.addMaterielToCollectionIfMissing(materielCollection, materiel);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Materiel to an array that doesn't contain it", () => {
          const materiel: IMateriel = { id: 123 };
          const materielCollection: IMateriel[] = [{ id: 456 }];
          expectedResult = service.addMaterielToCollectionIfMissing(materielCollection, materiel);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(materiel);
        });

        it('should add only unique Materiel to an array', () => {
          const materielArray: IMateriel[] = [{ id: 123 }, { id: 456 }, { id: 78424 }];
          const materielCollection: IMateriel[] = [{ id: 123 }];
          expectedResult = service.addMaterielToCollectionIfMissing(materielCollection, ...materielArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const materiel: IMateriel = { id: 123 };
          const materiel2: IMateriel = { id: 456 };
          expectedResult = service.addMaterielToCollectionIfMissing([], materiel, materiel2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(materiel);
          expect(expectedResult).toContain(materiel2);
        });

        it('should accept null and undefined values', () => {
          const materiel: IMateriel = { id: 123 };
          expectedResult = service.addMaterielToCollectionIfMissing([], null, materiel, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(materiel);
        });

        it('should return initial array if no Materiel is added', () => {
          const materielCollection: IMateriel[] = [{ id: 123 }];
          expectedResult = service.addMaterielToCollectionIfMissing(materielCollection, undefined, null);
          expect(expectedResult).toEqual(materielCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
