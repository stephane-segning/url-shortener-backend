import { Details } from 'express-useragent';
import { Lookup } from 'geoip-lite';

export interface RedirectModel {
  host: string;
  codeId: string;
  cookies?: Record<string, any>;
  lookup?: Lookup;
  userAgent?: Details;
}

export interface RedirectResponse {
  redirectUrl: string;
  isRedirect: boolean;
  render?: string;
  status: number;
}
