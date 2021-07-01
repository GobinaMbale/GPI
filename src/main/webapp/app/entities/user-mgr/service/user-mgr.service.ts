import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserMgr, getUserMgrIdentifier } from '../user-mgr.model';

export type EntityResponseType = HttpResponse<IUserMgr>;
export type EntityArrayResponseType = HttpResponse<IUserMgr[]>;

@Injectable({ providedIn: 'root' })
export class UserMgrService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-mgrs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userMgr: IUserMgr): Observable<EntityResponseType> {
    return this.http.post<IUserMgr>(this.resourceUrl, userMgr, { observe: 'response' });
  }

  update(userMgr: IUserMgr): Observable<EntityResponseType> {
    return this.http.put<IUserMgr>(`${this.resourceUrl}/${getUserMgrIdentifier(userMgr) as number}`, userMgr, { observe: 'response' });
  }

  partialUpdate(userMgr: IUserMgr): Observable<EntityResponseType> {
    return this.http.patch<IUserMgr>(`${this.resourceUrl}/${getUserMgrIdentifier(userMgr) as number}`, userMgr, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserMgr>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserMgr[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUserMgrToCollectionIfMissing(userMgrCollection: IUserMgr[], ...userMgrsToCheck: (IUserMgr | null | undefined)[]): IUserMgr[] {
    const userMgrs: IUserMgr[] = userMgrsToCheck.filter(isPresent);
    if (userMgrs.length > 0) {
      const userMgrCollectionIdentifiers = userMgrCollection.map(userMgrItem => getUserMgrIdentifier(userMgrItem)!);
      const userMgrsToAdd = userMgrs.filter(userMgrItem => {
        const userMgrIdentifier = getUserMgrIdentifier(userMgrItem);
        if (userMgrIdentifier == null || userMgrCollectionIdentifiers.includes(userMgrIdentifier)) {
          return false;
        }
        userMgrCollectionIdentifiers.push(userMgrIdentifier);
        return true;
      });
      return [...userMgrsToAdd, ...userMgrCollection];
    }
    return userMgrCollection;
  }
}
