import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import axios from 'axios';
import googleOAuthConfig from '../../config/google-oauth.config';

export interface GoogleUserInfo {
  email: string;
  name: string;
  picture?: string;
  email_verified: boolean;
}

@Injectable()
export class OAuthProviderService {
  constructor(
    @Inject(googleOAuthConfig.KEY)
    private googleOAuthConfiguration: ConfigType<typeof googleOAuthConfig>,
  ) {}

  /**
   * Exchange Google authorization code untuk access token
   */
  async exchangeGoogleCode(code: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          code,
          client_id: this.googleOAuthConfiguration.clientID,
          client_secret: this.googleOAuthConfiguration.clientSecret,
          redirect_uri: this.googleOAuthConfiguration.callbackURL,
          grant_type: 'authorization_code',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return response.data.access_token;
    } catch (error) {
      throw new UnauthorizedException('Failed to exchange authorization code');
    }
  }

  /**
   * Get user info dari Google menggunakan access token
   */
  async getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    try {
      const response = await axios.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return {
        email: response.data.email,
        name: response.data.name,
        picture: response.data.picture,
        email_verified: response.data.verified_email,
      };
    } catch (error) {
      throw new UnauthorizedException('Failed to get Google user info');
    }
  }

  /**
   * Complete Google OAuth flow: exchange code dan get user info
   */
  async authenticateWithGoogle(code: string): Promise<GoogleUserInfo> {
    const accessToken = await this.exchangeGoogleCode(code);
    const userInfo = await this.getGoogleUserInfo(accessToken);
    return userInfo;
  }
}
