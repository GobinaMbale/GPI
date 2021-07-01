jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IUserMgr, UserMgr } from '../user-mgr.model';
import { UserMgrService } from '../service/user-mgr.service';

import { UserMgrRoutingResolveService } from './user-mgr-routing-resolve.service';

describe('Service Tests', () => {
  describe('UserMgr routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: UserMgrRoutingResolveService;
    let service: UserMgrService;
    let resultUserMgr: IUserMgr | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(UserMgrRoutingResolveService);
      service = TestBed.inject(UserMgrService);
      resultUserMgr = undefined;
    });

    describe('resolve', () => {
      it('should return IUserMgr returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultUserMgr = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultUserMgr).toEqual({ id: 123 });
      });

      it('should return new IUserMgr if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultUserMgr = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultUserMgr).toEqual(new UserMgr());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as UserMgr })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultUserMgr = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultUserMgr).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
