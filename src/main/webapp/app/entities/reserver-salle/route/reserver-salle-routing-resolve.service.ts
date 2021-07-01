import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IReserverSalle, ReserverSalle } from '../reserver-salle.model';
import { ReserverSalleService } from '../service/reserver-salle.service';

@Injectable({ providedIn: 'root' })
export class ReserverSalleRoutingResolveService implements Resolve<IReserverSalle> {
  constructor(protected service: ReserverSalleService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IReserverSalle> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((reserverSalle: HttpResponse<ReserverSalle>) => {
          if (reserverSalle.body) {
            return of(reserverSalle.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ReserverSalle());
  }
}
