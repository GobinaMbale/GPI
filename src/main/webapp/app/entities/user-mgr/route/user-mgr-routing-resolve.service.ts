import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserMgr, UserMgr } from '../user-mgr.model';
import { UserMgrService } from '../service/user-mgr.service';

@Injectable({ providedIn: 'root' })
export class UserMgrRoutingResolveService implements Resolve<IUserMgr> {
  constructor(protected service: UserMgrService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserMgr> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userMgr: HttpResponse<UserMgr>) => {
          if (userMgr.body) {
            return of(userMgr.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new UserMgr());
  }
}
