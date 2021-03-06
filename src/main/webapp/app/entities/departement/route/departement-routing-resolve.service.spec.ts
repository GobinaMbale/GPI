jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IDepartement, Departement } from '../departement.model';
import { DepartementService } from '../service/departement.service';

import { DepartementRoutingResolveService } from './departement-routing-resolve.service';

describe('Service Tests', () => {
  describe('Departement routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: DepartementRoutingResolveService;
    let service: DepartementService;
    let resultDepartement: IDepartement | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(DepartementRoutingResolveService);
      service = TestBed.inject(DepartementService);
      resultDepartement = undefined;
    });

    describe('resolve', () => {
      it('should return IDepartement returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDepartement = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultDepartement).toEqual({ id: 123 });
      });

      it('should return new IDepartement if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDepartement = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultDepartement).toEqual(new Departement());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Departement })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDepartement = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultDepartement).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
