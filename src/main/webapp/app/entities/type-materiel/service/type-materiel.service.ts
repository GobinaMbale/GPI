import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITypeMateriel, getTypeMaterielIdentifier } from '../type-materiel.model';

export type EntityResponseType = HttpResponse<ITypeMateriel>;
export type EntityArrayResponseType = HttpResponse<ITypeMateriel[]>;

@Injectable({ providedIn: 'root' })
export class TypeMaterielService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/type-materiels');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(typeMateriel: ITypeMateriel): Observable<EntityResponseType> {
    return this.http.post<ITypeMateriel>(this.resourceUrl, typeMateriel, { observe: 'response' });
  }

  update(typeMateriel: ITypeMateriel): Observable<EntityResponseType> {
    return this.http.put<ITypeMateriel>(`${this.resourceUrl}/${getTypeMaterielIdentifier(typeMateriel) as number}`, typeMateriel, {
      observe: 'response',
    });
  }

  partialUpdate(typeMateriel: ITypeMateriel): Observable<EntityResponseType> {
    return this.http.patch<ITypeMateriel>(`${this.resourceUrl}/${getTypeMaterielIdentifier(typeMateriel) as number}`, typeMateriel, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITypeMateriel>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITypeMateriel[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTypeMaterielToCollectionIfMissing(
    typeMaterielCollection: ITypeMateriel[],
    ...typeMaterielsToCheck: (ITypeMateriel | null | undefined)[]
  ): ITypeMateriel[] {
    const typeMateriels: ITypeMateriel[] = typeMaterielsToCheck.filter(isPresent);
    if (typeMateriels.length > 0) {
      const typeMaterielCollectionIdentifiers = typeMaterielCollection.map(
        typeMaterielItem => getTypeMaterielIdentifier(typeMaterielItem)!
      );
      const typeMaterielsToAdd = typeMateriels.filter(typeMaterielItem => {
        const typeMaterielIdentifier = getTypeMaterielIdentifier(typeMaterielItem);
        if (typeMaterielIdentifier == null || typeMaterielCollectionIdentifiers.includes(typeMaterielIdentifier)) {
          return false;
        }
        typeMaterielCollectionIdentifiers.push(typeMaterielIdentifier);
        return true;
      });
      return [...typeMaterielsToAdd, ...typeMaterielCollection];
    }
    return typeMaterielCollection;
  }
}
