import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEnseigner, Enseigner } from '../enseigner.model';
import { EnseignerService } from '../service/enseigner.service';

@Injectable({ providedIn: 'root' })
export class EnseignerRoutingResolveService implements Resolve<IEnseigner> {
  constructor(protected service: EnseignerService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEnseigner> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((enseigner: HttpResponse<Enseigner>) => {
          if (enseigner.body) {
            return of(enseigner.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Enseigner());
  }
}
