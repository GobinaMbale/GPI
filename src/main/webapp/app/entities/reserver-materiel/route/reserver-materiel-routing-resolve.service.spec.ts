jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IReserverMateriel, ReserverMateriel } from '../reserver-materiel.model';
import { ReserverMaterielService } from '../service/reserver-materiel.service';

import { ReserverMaterielRoutingResolveService } from './reserver-materiel-routing-resolve.service';

describe('Service Tests', () => {
  describe('ReserverMateriel routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ReserverMaterielRoutingResolveService;
    let service: ReserverMaterielService;
    let resultReserverMateriel: IReserverMateriel | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ReserverMaterielRoutingResolveService);
      service = TestBed.inject(ReserverMaterielService);
      resultReserverMateriel = undefined;
    });

    describe('resolve', () => {
      it('should return IReserverMateriel returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultReserverMateriel = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultReserverMateriel).toEqual({ id: 123 });
      });

      it('should return new IReserverMateriel if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultReserverMateriel = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultReserverMateriel).toEqual(new ReserverMateriel());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ReserverMateriel })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultReserverMateriel = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultReserverMateriel).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
