import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { MaterielService } from '../../materiel/service/materiel.service';
import { Materiel } from '../../materiel/materiel.model';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ReserverMaterielRoutingResolve2Service implements Resolve<Materiel> {
  constructor(private service: MaterielService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Materiel> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((materiel: HttpResponse<Materiel>) => {
          if (materiel.body) {
            return of(materiel.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Materiel());
  }
}
