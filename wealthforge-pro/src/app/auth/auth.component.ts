import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type Role = 'INVESTOR' | 'ADVISOR' | 'ADMIN';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  readonly roles: { key: Role; title: string; desc: string }[] = [
    { key: 'INVESTOR', title: 'Investor', desc: 'Manage holdings, buy/sell, and portfolio growth.' },
    { key: 'ADVISOR', title: 'Advisor', desc: 'Guide investors, assign strategies, and AI insights.' },
    { key: 'ADMIN', title: 'Admin', desc: 'Control platform stocks, companies, and operations.' }
  ];

  selectedRole: Role | null = null;
  isLogin = true;
  authData = {
    name: '',
    email: '',
    password: ''
  };
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(private readonly router: Router) {}

  get canSubmit(): boolean {
    const email = this.authData.email.trim();
    const password = this.authData.password.trim();
    const name = this.authData.name.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.selectedRole) {
      return false;
    }
    if (!email || !password || !emailRegex.test(email)) {
      return false;
    }
    if (password.length < 6) {
      return false;
    }
    if (!this.isLogin && name.length < 3) {
      return false;
    }
    return true;
  }

  get showValidationHint(): boolean {
    const hasAnyInput = Boolean(this.authData.email || this.authData.password || this.authData.name);
    return hasAnyInput && !this.canSubmit;
  }

  selectRole(role: Role): void {
    this.selectedRole = role;
    this.isLogin = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  toggleAuthMode(): void {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
    this.successMessage = '';
  }

  backToRoleSelect(): void {
    this.selectedRole = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  submit(): void {
    if (!this.selectedRole || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.canSubmit) {
      this.errorMessage = 'Please fill all required fields.';
      this.isSubmitting = false;
      return;
    }

    // Frontend-only test mode: no backend auth call.
    localStorage.setItem('wf_token', `mock-token-${Date.now()}`);
    localStorage.setItem('wf_role', this.selectedRole);

    if (!this.isLogin) {
      this.successMessage = 'Registered in frontend test mode. Redirecting to dashboard...';
    }

    this.router.navigate(['/dashboard', this.selectedRole.toLowerCase()]);
    this.isSubmitting = false;
  }
}
