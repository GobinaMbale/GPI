jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IReserverSalle, ReserverSalle } from '../reserver-salle.model';
import { ReserverSalleService } from '../service/reserver-salle.service';

import { ReserverSalleRoutingResolveService } from './reserver-salle-routing-resolve.service';

describe('Service Tests', () => {
  describe('ReserverSalle routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ReserverSalleRoutingResolveService;
    let service: ReserverSalleService;
    let resultReserverSalle: IReserverSalle | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ReserverSalleRoutingResolveService);
      service = TestBed.inject(ReserverSalleService);
      resultReserverSalle = undefined;
    });

    describe('resolve', () => {
      it('should return IReserverSalle returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultReserverSalle = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultReserverSalle).toEqual({ id: 123 });
      });

      it('should return new IReserverSalle if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultReserverSalle = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultReserverSalle).toEqual(new ReserverSalle());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ReserverSalle })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultReserverSalle = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultReserverSalle).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
