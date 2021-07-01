import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITypeMateriel, TypeMateriel } from '../type-materiel.model';

import { TypeMaterielService } from './type-materiel.service';

describe('Service Tests', () => {
  describe('TypeMateriel Service', () => {
    let service: TypeMaterielService;
    let httpMock: HttpTestingController;
    let elemDefault: ITypeMateriel;
    let expectedResult: ITypeMateriel | ITypeMateriel[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TypeMaterielService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        libelle: 'AAAAAAA',
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

      it('should create a TypeMateriel', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new TypeMateriel()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a TypeMateriel', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            libelle: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a TypeMateriel', () => {
        const patchObject = Object.assign({}, new TypeMateriel());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of TypeMateriel', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            libelle: 'BBBBBB',
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

      it('should delete a TypeMateriel', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTypeMaterielToCollectionIfMissing', () => {
        it('should add a TypeMateriel to an empty array', () => {
          const typeMateriel: ITypeMateriel = { id: 123 };
          expectedResult = service.addTypeMaterielToCollectionIfMissing([], typeMateriel);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(typeMateriel);
        });

        it('should not add a TypeMateriel to an array that contains it', () => {
          const typeMateriel: ITypeMateriel = { id: 123 };
          const typeMaterielCollection: ITypeMateriel[] = [
            {
              ...typeMateriel,
            },
            { id: 456 },
          ];
          expectedResult = service.addTypeMaterielToCollectionIfMissing(typeMaterielCollection, typeMateriel);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a TypeMateriel to an array that doesn't contain it", () => {
          const typeMateriel: ITypeMateriel = { id: 123 };
          const typeMaterielCollection: ITypeMateriel[] = [{ id: 456 }];
          expectedResult = service.addTypeMaterielToCollectionIfMissing(typeMaterielCollection, typeMateriel);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(typeMateriel);
        });

        it('should add only unique TypeMateriel to an array', () => {
          const typeMaterielArray: ITypeMateriel[] = [{ id: 123 }, { id: 456 }, { id: 94030 }];
          const typeMaterielCollection: ITypeMateriel[] = [{ id: 123 }];
          expectedResult = service.addTypeMaterielToCollectionIfMissing(typeMaterielCollection, ...typeMaterielArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const typeMateriel: ITypeMateriel = { id: 123 };
          const typeMateriel2: ITypeMateriel = { id: 456 };
          expectedResult = service.addTypeMaterielToCollectionIfMissing([], typeMateriel, typeMateriel2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(typeMateriel);
          expect(expectedResult).toContain(typeMateriel2);
        });

        it('should accept null and undefined values', () => {
          const typeMateriel: ITypeMateriel = { id: 123 };
          expectedResult = service.addTypeMaterielToCollectionIfMissing([], null, typeMateriel, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(typeMateriel);
        });

        it('should return initial array if no TypeMateriel is added', () => {
          const typeMaterielCollection: ITypeMateriel[] = [{ id: 123 }];
          expectedResult = service.addTypeMaterielToCollectionIfMissing(typeMaterielCollection, undefined, null);
          expect(expectedResult).toEqual(typeMaterielCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
