import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IReserverMateriel, ReserverMateriel } from '../reserver-materiel.model';
import { ReserverMaterielService } from '../service/reserver-materiel.service';

@Injectable({ providedIn: 'root' })
export class ReserverMaterielRoutingResolveService implements Resolve<IReserverMateriel> {
  constructor(protected service: ReserverMaterielService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IReserverMateriel> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((reserverMateriel: HttpResponse<ReserverMateriel>) => {
          if (reserverMateriel.body) {
            return of(reserverMateriel.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ReserverMateriel());
  }
}
