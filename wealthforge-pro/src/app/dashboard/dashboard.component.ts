import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

type Role = 'investor' | 'advisor' | 'admin';
type Scope = Role;
type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type FieldType = 'text' | 'number' | 'email' | 'textarea';

interface ActionField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  step?: number;
  placeholder?: string;
  helpText?: string;
  queryParam?: boolean;
  pathParam?: boolean;
}

interface UserAction {
  id: number;
  role: Scope;
  group: string;
  title: string;
  summary: string;
  method: ApiMethod;
  url: string;
  fields?: ActionField[];
  bodyType?: 'default' | 'advisorSuggestion';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  readonly actions: UserAction[] = [
    {
      id: 7,
      role: 'admin',
      group: 'Market Setup',
      title: 'Create New Company',
      summary: 'Add a listed company profile to the platform.',
      method: 'POST',
      url: 'http://localhost:8083/api/admin/companies',
      fields: [
        { key: 'companyName', label: 'Company Name', type: 'text', required: true, minLength: 2, maxLength: 80, placeholder: 'Apple Inc' },
        { key: 'sector', label: 'Sector', type: 'text', required: true, minLength: 3, maxLength: 40, placeholder: 'Technology' }
      ]
    },
    { id: 8, role: 'admin', group: 'Market Setup', title: 'View All Companies', summary: 'See all companies currently available.', method: 'GET', url: 'http://localhost:8083/api/admin/companies' },
    {
      id: 9,
      role: 'admin',
      group: 'Stock Inventory',
      title: 'Add Stock Inventory',
      summary: 'Add stock symbol, price, and quantity to inventory.',
      method: 'POST',
      url: 'http://localhost:8083/api/admin/stocks',
      fields: [
        { key: 'symbol', label: 'Stock Symbol', type: 'text', required: true, minLength: 1, maxLength: 8, placeholder: 'AAPL' },
        { key: 'companyName', label: 'Company Name', type: 'text', required: true, minLength: 2, maxLength: 80, placeholder: 'Apple Inc' },
        { key: 'currentPrice', label: 'Current Price', type: 'number', required: true, min: 0.01, step: 0.01, placeholder: '175.50' },
        { key: 'quantity', label: 'Quantity', type: 'number', required: true, min: 1, step: 1, placeholder: '1000' }
      ]
    },
    { id: 10, role: 'admin', group: 'Stock Inventory', title: 'View All Stocks', summary: 'Get the full list of available stocks.', method: 'GET', url: 'http://localhost:8083/api/admin/stocks' },
    {
      id: 11,
      role: 'admin',
      group: 'Stock Inventory',
      title: 'View Stock by Symbol',
      summary: 'Check specific stock details quickly.',
      method: 'GET',
      url: 'http://localhost:8083/api/admin/stocks/{symbol}',
      fields: [{ key: 'symbol', label: 'Stock Symbol', type: 'text', required: true, minLength: 1, maxLength: 8, pathParam: true, placeholder: 'AAPL' }]
    },
    {
      id: 12,
      role: 'admin',
      group: 'Stock Inventory',
      title: 'Update Stock Price',
      summary: 'Push latest market price for a stock.',
      method: 'PUT',
      url: 'http://localhost:8083/api/admin/stocks/update-price',
      fields: [
        { key: 'symbol', label: 'Stock Symbol', type: 'text', required: true, minLength: 1, maxLength: 8, placeholder: 'AAPL' },
        { key: 'price', label: 'Updated Price', type: 'number', required: true, min: 0.01, step: 0.01, placeholder: '180.00' }
      ]
    },
    { id: 13, role: 'admin', group: 'User Oversight', title: 'View Investors', summary: 'Review registered investors and activity participants.', method: 'GET', url: 'http://localhost:8083/api/admin/investors' },
    { id: 35, role: 'admin', group: 'Portfolio Oversight', title: 'View All Portfolios', summary: 'Admin-wide list of all created portfolios.', method: 'GET', url: 'http://localhost:8088/api/admin/portfolios' },
    {
      id: 14,
      role: 'advisor',
      group: 'Advisor Profile',
      title: 'Create Advisor Profile',
      summary: 'Register your advisor professional profile.',
      method: 'POST',
      url: 'http://localhost:8084/api/advisor/register',
      fields: [
        { key: 'name', label: 'Advisor Name', type: 'text', required: true, minLength: 3, maxLength: 80, placeholder: 'John Advisor' },
        { key: 'email', label: 'Email', type: 'email', required: true, maxLength: 120, placeholder: 'advisor@test.com' },
        { key: 'specialization', label: 'Specialization', type: 'text', required: true, minLength: 3, maxLength: 50, placeholder: 'Equity' }
      ]
    },
    { id: 15, role: 'advisor', group: 'Advisor Workspace', title: 'Browse Advisors', summary: 'See all advisors available in the system.', method: 'GET', url: 'http://localhost:8084/api/advisor/list/all' },
    {
      id: 16,
      role: 'advisor',
      group: 'Advisor Workspace',
      title: 'Ask AI Strategy Assistant',
      summary: 'Get quick suggestions for investor strategy.',
      method: 'GET',
      url: 'http://localhost:8084/api/advisor/chatbot/ask',
      fields: [{ key: 'question', label: 'Your Question', type: 'textarea', required: true, minLength: 8, maxLength: 240, queryParam: true, placeholder: 'What stocks should I buy?' }]
    },
    {
      id: 17,
      role: 'advisor',
      group: 'Advisor Workspace',
      title: 'Assign Investor to Advisor',
      summary: 'Link an investor to your advisory profile.',
      method: 'POST',
      url: 'http://localhost:8084/api/advisor/assign',
      fields: [
        { key: 'advisorId', label: 'Advisor ID', type: 'number', required: true, min: 1, step: 1, placeholder: '1' },
        { key: 'investorId', label: 'Investor ID', type: 'number', required: true, min: 1, step: 1, placeholder: '1' }
      ]
    },
    {
      id: 18,
      role: 'advisor',
      group: 'Advisor Workspace',
      title: 'Share Advice with Investors',
      summary: 'Send investment advice to a selected investor.',
      method: 'POST',
      url: 'http://localhost:8084/api/advisor/suggest/{advisorId}',
      bodyType: 'advisorSuggestion',
      fields: [
        { key: 'advisorId', label: 'Advisor ID', type: 'number', required: true, min: 1, step: 1, pathParam: true, placeholder: '1' },
        { key: 'investorId', label: 'Investor ID', type: 'number', required: true, min: 1, step: 1, placeholder: '1' },
        { key: 'advice', label: 'Advice Message', type: 'textarea', required: true, minLength: 12, maxLength: 300, placeholder: 'Buy AAPL - strong Q4 earnings' }
      ]
    },
    { id: 19, role: 'investor', group: 'Market Discovery', title: 'Explore Companies', summary: 'View all available companies before investing.', method: 'GET', url: 'http://localhost:8085/api/investor/companyList' },
    { id: 20, role: 'investor', group: 'Market Discovery', title: 'Explore Stocks', summary: 'Review stock symbols and current listings.', method: 'GET', url: 'http://localhost:8085/api/investor/stockList' },
    { id: 21, role: 'investor', group: 'Advisor Connect', title: 'Find Advisors', summary: 'Search advisors to get portfolio guidance.', method: 'GET', url: 'http://localhost:8085/api/investor/searchAdvisor' },
    {
      id: 23,
      role: 'investor',
      group: 'Trading',
      title: 'Buy Stock',
      summary: 'Purchase stock quantity for your account.',
      method: 'POST',
      url: 'http://localhost:8085/api/investor/buy',
      fields: [
        { key: 'investorId', label: 'Investor ID', type: 'number', required: true, min: 1, step: 1, placeholder: '1' },
        { key: 'symbol', label: 'Stock Symbol', type: 'text', required: true, minLength: 1, maxLength: 8, placeholder: 'AAPL' },
        { key: 'quantity', label: 'Quantity', type: 'number', required: true, min: 1, step: 1, placeholder: '5' }
      ]
    },
    {
      id: 24,
      role: 'investor',
      group: 'Trading',
      title: 'Sell Stock',
      summary: 'Sell existing stock units from holdings.',
      method: 'POST',
      url: 'http://localhost:8085/api/investor/sell',
      fields: [
        { key: 'investorId', label: 'Investor ID', type: 'number', required: true, min: 1, step: 1, placeholder: '1' },
        { key: 'assetName', label: 'Asset Symbol', type: 'text', required: true, minLength: 1, maxLength: 8, placeholder: 'AAPL' },
        { key: 'quantity', label: 'Quantity', type: 'number', required: true, min: 1, step: 1, placeholder: '2' }
      ]
    },
    {
      id: 25,
      role: 'investor',
      group: 'Transfers',
      title: 'Transfer Funds',
      summary: 'Move funds to another investor account.',
      method: 'POST',
      url: 'http://localhost:8085/api/investor/transfer',
      fields: [
        { key: 'fromInvestorId', label: 'From Investor ID', type: 'number', required: true, min: 1, step: 1, placeholder: '1' },
        { key: 'toInvestorId', label: 'To Investor ID', type: 'number', required: true, min: 1, step: 1, placeholder: '2' },
        { key: 'amount', label: 'Amount', type: 'number', required: true, min: 0.01, step: 0.01, placeholder: '500' }
      ]
    },
    {
      id: 26,
      role: 'investor',
      group: 'Tracking',
      title: 'View Holdings',
      summary: 'Check your current stock holdings.',
      method: 'GET',
      url: 'http://localhost:8085/api/investor/holding/{investorId}',
      fields: [{ key: 'investorId', label: 'Investor ID', type: 'number', required: true, min: 1, step: 1, pathParam: true, placeholder: '1' }]
    },
    {
      id: 27,
      role: 'investor',
      group: 'Tracking',
      title: 'View Transactions',
      summary: 'Review your transaction history.',
      method: 'GET',
      url: 'http://localhost:8085/api/investor/transactions/{investorId}',
      fields: [{ key: 'investorId', label: 'Investor ID', type: 'number', required: true, min: 1, step: 1, pathParam: true, placeholder: '1' }]
    },
    {
      id: 28,
      role: 'investor',
      group: 'Portfolio Management',
      title: 'Create Portfolio',
      summary: 'Create a new portfolio with goals.',
      method: 'POST',
      url: 'http://localhost:8088/api/portfolios',
      fields: [
        { key: 'name', label: 'Portfolio Name', type: 'text', required: true, minLength: 3, maxLength: 80, placeholder: 'My Growth Portfolio' },
        { key: 'description', label: 'Description', type: 'textarea', required: true, minLength: 8, maxLength: 220, placeholder: 'Long-term equity holdings' }
      ]
    },
    { id: 29, role: 'investor', group: 'Portfolio Management', title: 'View My Portfolios', summary: 'Load all your existing portfolios.', method: 'GET', url: 'http://localhost:8088/api/portfolios/my' },
    {
      id: 30,
      role: 'investor',
      group: 'Portfolio Management',
      title: 'View Portfolio Details',
      summary: 'Open details for one portfolio.',
      method: 'GET',
      url: 'http://localhost:8088/api/portfolios/{portfolioId}',
      fields: [{ key: 'portfolioId', label: 'Portfolio ID', type: 'number', required: true, min: 1, step: 1, pathParam: true, placeholder: '1' }]
    },
    {
      id: 31,
      role: 'investor',
      group: 'Portfolio Management',
      title: 'View Portfolio Holdings',
      summary: 'Check assets inside a portfolio.',
      method: 'GET',
      url: 'http://localhost:8088/api/portfolios/{portfolioId}/holdings',
      fields: [{ key: 'portfolioId', label: 'Portfolio ID', type: 'number', required: true, min: 1, step: 1, pathParam: true, placeholder: '1' }]
    },
    {
      id: 32,
      role: 'investor',
      group: 'Portfolio Analytics',
      title: 'View Profit and Loss',
      summary: 'Track portfolio performance metrics.',
      method: 'GET',
      url: 'http://localhost:8088/api/portfolios/{portfolioId}/performance',
      fields: [{ key: 'portfolioId', label: 'Portfolio ID', type: 'number', required: true, min: 1, step: 1, pathParam: true, placeholder: '1' }]
    },
    {
      id: 33,
      role: 'investor',
      group: 'Portfolio Analytics',
      title: 'View Asset Allocation',
      summary: 'See distribution across asset classes.',
      method: 'GET',
      url: 'http://localhost:8088/api/portfolios/{portfolioId}/allocation',
      fields: [{ key: 'portfolioId', label: 'Portfolio ID', type: 'number', required: true, min: 1, step: 1, pathParam: true, placeholder: '1' }]
    },
    {
      id: 34,
      role: 'investor',
      group: 'Portfolio Transfers',
      title: 'Transfer Between Portfolios',
      summary: 'Move funds from one portfolio to another.',
      method: 'POST',
      url: 'http://localhost:8088/api/portfolios/transfer',
      fields: [
        { key: 'fromPortfolioId', label: 'From Portfolio ID', type: 'number', required: true, min: 1, step: 1, placeholder: '1' },
        { key: 'toPortfolioId', label: 'To Portfolio ID', type: 'number', required: true, min: 1, step: 1, placeholder: '2' },
        { key: 'amount', label: 'Amount', type: 'number', required: true, min: 0.01, step: 0.01, placeholder: '1000' }
      ]
    }
  ];

  role: Role = 'investor';
  selectedAction!: UserAction;
  selectedGroup = '';
  formData: Record<string, string | number> = {};
  isLoading = false;
  dataState: 'none' | 'empty' | 'list' | 'object' | 'text' = 'none';
  dataList: Record<string, unknown>[] = [];
  dataObject: Record<string, unknown> = {};
  dataText = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly http: HttpClient
  ) {
    const routeRole = (this.route.snapshot.paramMap.get('role') || 'investor').toLowerCase() as Role;
    const savedRole = (localStorage.getItem('wf_role') || '').toLowerCase() as Role;
    this.role = ['investor', 'advisor', 'admin'].includes(savedRole) ? savedRole : routeRole;
    this.selectedGroup = this.groupedActions[0]?.group || '';
    this.selectedAction = this.currentGroupActions[0] || this.roleActions[0];
    this.initializeForm(this.selectedAction);
  }

  get roleTitle(): string {
    return this.role.charAt(0).toUpperCase() + this.role.slice(1);
  }

  get roleActions(): UserAction[] {
    return this.actions.filter((action) => action.role === this.role);
  }

  get groupedActions(): { group: string; items: UserAction[] }[] {
    const groups: Record<string, UserAction[]> = {};
    for (const action of this.roleActions) {
      if (!groups[action.group]) {
        groups[action.group] = [];
      }
      groups[action.group].push(action);
    }
    return Object.keys(groups).map((group) => ({ group, items: groups[group] }));
  }

  get currentGroupActions(): UserAction[] {
    const activeGroup = this.groupedActions.find((group) => group.group === this.selectedGroup);
    return activeGroup?.items || [];
  }

  selectGroup(group: string): void {
    this.selectedGroup = group;
    const firstAction = this.currentGroupActions[0];
    if (firstAction) {
      this.selectAction(firstAction);
    }
  }

  selectAction(action: UserAction): void {
    this.selectedAction = action;
    this.initializeForm(action);
    this.resetResultState();
    if (action.method === 'GET' && (!action.fields || action.fields.length === 0)) {
      this.runAction();
    }
  }

  runAction(): void {
    if (!this.selectedAction || this.isLoading) {
      return;
    }

    const prepared = this.prepareRequest();
    if (!prepared.ok) {
      this.dataState = 'empty';
      return;
    }

    this.isLoading = true;
    this.resetResultState();

    this.http
      .request(this.selectedAction.method, prepared.url, {
        body: prepared.body,
        observe: 'response'
      })
      .subscribe({
        next: (res) => {
          this.handleGetResult(res.body);
          this.isLoading = false;
        },
        error: (_err: HttpErrorResponse) => {
          this.dataState = 'empty';
          this.isLoading = false;
        }
      });
  }

  logout(): void {
    localStorage.removeItem('wf_token');
    localStorage.removeItem('wf_role');
    this.router.navigate(['/auth']);
  }

  toDisplayValue(value: unknown): string {
    if (value === null || value === undefined) {
      return '-';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  }

  private initializeForm(action: UserAction): void {
    this.formData = {};
    for (const field of action.fields ?? []) {
      this.formData[field.key] = '';
    }
  }

  private resetResultState(): void {
    this.dataState = 'none';
    this.dataList = [];
    this.dataObject = {};
    this.dataText = '';
  }

  private handleGetResult(body: unknown): void {
    if (Array.isArray(body)) {
      if (body.length === 0) {
        this.dataState = 'empty';
        return;
      }
      this.dataState = 'list';
      this.dataList = body.map((item) => (typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : { value: item }));
      return;
    }

    if (body && typeof body === 'object') {
      const obj = body as Record<string, unknown>;
      if (Object.keys(obj).length === 0) {
        this.dataState = 'empty';
        return;
      }
      this.dataState = 'object';
      this.dataObject = obj;
      return;
    }

    if (body === null || body === undefined || body === '') {
      this.dataState = 'empty';
      return;
    }

    this.dataState = 'text';
    this.dataText = String(body);
  }

  private prepareRequest(): { ok: true; url: string; body?: unknown } | { ok: false; error: string } {
    let resolvedUrl = this.selectedAction.url;
    const query = new URLSearchParams();
    const body: Record<string, unknown> = {};

    for (const field of this.selectedAction.fields ?? []) {
      const raw = this.formData[field.key];
      const value = typeof raw === 'string' ? raw.trim() : raw;

      if (field.required && (value === '' || value === undefined || value === null)) {
        return { ok: false, error: `${field.label} is required.` };
      }
      if (value === '' || value === undefined || value === null) {
        continue;
      }

      if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(value))) {
          return { ok: false, error: `${field.label} must be a valid email address.` };
        }
      }

      if (field.type === 'number') {
        const num = Number(value);
        if (Number.isNaN(num)) {
          return { ok: false, error: `${field.label} must be a number.` };
        }
        if (field.min !== undefined && num < field.min) {
          return { ok: false, error: `${field.label} must be at least ${field.min}.` };
        }
        if (field.max !== undefined && num > field.max) {
          return { ok: false, error: `${field.label} must be less than or equal to ${field.max}.` };
        }
        if (field.pathParam) {
          resolvedUrl = resolvedUrl.replace(`{${field.key}}`, encodeURIComponent(String(num)));
        } else if (field.queryParam) {
          query.set(field.key, String(num));
        } else {
          body[field.key] = num;
        }
        continue;
      }

      const str = String(value);
      if (field.minLength !== undefined && str.length < field.minLength) {
        return { ok: false, error: `${field.label} should be at least ${field.minLength} characters.` };
      }
      if (field.maxLength !== undefined && str.length > field.maxLength) {
        return { ok: false, error: `${field.label} should be at most ${field.maxLength} characters.` };
      }

      if (field.pathParam) {
        resolvedUrl = resolvedUrl.replace(`{${field.key}}`, encodeURIComponent(str));
      } else if (field.queryParam) {
        query.set(field.key, str);
      } else {
        body[field.key] = str;
      }
    }

    if (resolvedUrl.includes('{')) {
      return { ok: false, error: 'Please fill all required ID fields.' };
    }

    const queryString = query.toString();
    if (queryString) {
      resolvedUrl = `${resolvedUrl}?${queryString}`;
    }

    if (this.selectedAction.method === 'GET' || this.selectedAction.method === 'DELETE') {
      return { ok: true, url: resolvedUrl };
    }

    if (this.selectedAction.bodyType === 'advisorSuggestion') {
      return {
        ok: true,
        url: resolvedUrl,
        body: [{ investorId: body['investorId'], advice: body['advice'] }]
      };
    }

    return { ok: true, url: resolvedUrl, body };
  }
}
