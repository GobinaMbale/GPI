import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserMgr } from '../user-mgr.model';

@Component({
  selector: 'jhi-user-mgr-detail',
  templateUrl: './user-mgr-detail.component.html',
})
export class UserMgrDetailComponent implements OnInit {
  userMgr: IUserMgr | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userMgr }) => {
      this.userMgr = userMgr;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
