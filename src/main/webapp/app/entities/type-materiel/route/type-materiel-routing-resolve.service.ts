import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITypeMateriel, TypeMateriel } from '../type-materiel.model';
import { TypeMaterielService } from '../service/type-materiel.service';

@Injectable({ providedIn: 'root' })
export class TypeMaterielRoutingResolveService implements Resolve<ITypeMateriel> {
  constructor(protected service: TypeMaterielService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITypeMateriel> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((typeMateriel: HttpResponse<TypeMateriel>) => {
          if (typeMateriel.body) {
            return of(typeMateriel.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TypeMateriel());
  }
}
