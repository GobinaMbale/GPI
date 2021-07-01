jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITypeMateriel, TypeMateriel } from '../type-materiel.model';
import { TypeMaterielService } from '../service/type-materiel.service';

import { TypeMaterielRoutingResolveService } from './type-materiel-routing-resolve.service';

describe('Service Tests', () => {
  describe('TypeMateriel routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: TypeMaterielRoutingResolveService;
    let service: TypeMaterielService;
    let resultTypeMateriel: ITypeMateriel | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(TypeMaterielRoutingResolveService);
      service = TestBed.inject(TypeMaterielService);
      resultTypeMateriel = undefined;
    });

    describe('resolve', () => {
      it('should return ITypeMateriel returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTypeMateriel = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTypeMateriel).toEqual({ id: 123 });
      });

      it('should return new ITypeMateriel if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTypeMateriel = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultTypeMateriel).toEqual(new TypeMateriel());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as TypeMateriel })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTypeMateriel = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTypeMateriel).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
