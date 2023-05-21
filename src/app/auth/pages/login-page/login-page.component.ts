import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { AuthService } from '../../shared/services/auth.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  public modalVisible: boolean = false;
  public modalMessage: string = '';

  private subskink = new SubSink();

  constructor(
    private readonly router: Router,
    private readonly auth: AuthService
  ) {}
  
  ngOnInit(): void {
    
    this.subskink.sink = this.auth.loggedIn$.subscribe((result) => {

      if (typeof result === 'string') {

        this.modalVisible = true;
        this.modalMessage = 'An error happend while trying to log in';

        console.error('Error:', result);

        return;
      }

      this.router.navigateByUrl('/');
    });
  }

  ngOnDestroy(): void {

    this.subskink.unsubscribe();
  }

  public logIn(): void {

    if (!environment.production) {
      
      this.modalVisible = true;
      this.modalMessage = 'This function is only available in production.';

      return;
    }

    this.subskink.sink = this.auth.logIn(this.auth.authClient).subscribe();
  }
}
