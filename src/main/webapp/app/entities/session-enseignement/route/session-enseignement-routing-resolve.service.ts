import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISessionEnseignement, SessionEnseignement } from '../session-enseignement.model';
import { SessionEnseignementService } from '../service/session-enseignement.service';

@Injectable({ providedIn: 'root' })
export class SessionEnseignementRoutingResolveService implements Resolve<ISessionEnseignement> {
  constructor(protected service: SessionEnseignementService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISessionEnseignement> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((sessionEnseignement: HttpResponse<SessionEnseignement>) => {
          if (sessionEnseignement.body) {
            return of(sessionEnseignement.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SessionEnseignement());
  }
}
