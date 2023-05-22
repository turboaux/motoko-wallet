import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss']
})
export class TestPageComponent implements OnInit, OnDestroy {
  
  private subskink = new SubSink();

  constructor(private readonly auth: AuthService) {}
  
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subskink.unsubscribe();
  }

  public checkAuthStatus(): void {
    this.subskink.sink = this.auth.isAuthenticated(this.auth.authClient).subscribe((res) => console.log(res));
  }

  public checkMyPrincipal(): void {

    this.auth.getIdentity().subscribe((i) => console.log(i.getPrincipal().toString()));
  }

  public logOut(): void {
    this.subskink.sink = this.auth.logOut(this.auth.authClient).subscribe();
  }
}
