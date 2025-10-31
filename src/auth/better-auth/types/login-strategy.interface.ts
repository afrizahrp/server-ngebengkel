import {
  DeviceInfo,
  LoginResponse,
  TwoFactorLoginResponse,
} from './auth.types';

export interface LoginStrategy<T = any> {
  execute(
    credentials: T,
    deviceInfo?: DeviceInfo,
  ): Promise<LoginResponse | TwoFactorLoginResponse>;
}



