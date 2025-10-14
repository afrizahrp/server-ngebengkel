import axios from 'axios';

/**
 * Helper untuk Google OAuth implementation
 * Untuk implementasi penuh Google OAuth dengan Better Auth
 */

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export class GoogleOAuthHelper {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.GOOGLE_CLIENT_ID || '';
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
    this.redirectUri = process.env.GOOGLE_REDIRECT_URI || '';
  }

  /**
   * Generate Google OAuth URL
   */
  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'email profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    if (state) {
      params.append('state', state);
    }

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Exchange authorization code untuk access token
   */
  async exchangeCodeForToken(code: string): Promise<GoogleTokenResponse> {
    const tokenUrl = 'https://oauth2.googleapis.com/token';

    const params = new URLSearchParams({
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
    });

    try {
      const response = await axios.post<GoogleTokenResponse>(tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw new Error('Failed to exchange authorization code');
    }
  }

  /**
   * Get user info dari Google
   */
  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';

    try {
      const response = await axios.get<GoogleUserInfo>(userInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error getting user info:', error);
      throw new Error('Failed to get user info from Google');
    }
  }

  /**
   * Verify ID token dari Google
   */
  async verifyIdToken(idToken: string): Promise<any> {
    const verifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;

    try {
      const response = await axios.get(verifyUrl);
      return response.data;
    } catch (error) {
      console.error('Error verifying ID token:', error);
      throw new Error('Failed to verify ID token');
    }
  }

  /**
   * Complete OAuth flow - dari code sampai user info
   */
  async completeOAuthFlow(
    code: string,
  ): Promise<{ tokens: GoogleTokenResponse; user: GoogleUserInfo }> {
    // Exchange code untuk tokens
    const tokens = await this.exchangeCodeForToken(code);

    // Get user info
    const user = await this.getUserInfo(tokens.access_token);

    return { tokens, user };
  }
}

/**
 * Example usage di controller:
 *
 * @Public()
 * @Get('google/callback')
 * async googleCallback(@Query('code') code: string, @Res() res: Response) {
 *   const googleHelper = new GoogleOAuthHelper();
 *
 *   try {
 *     const { user } = await googleHelper.completeOAuthFlow(code);
 *
 *     // Login atau register user
 *     const authResult = await this.betterAuthService.loginWithGoogle({
 *       email: user.email,
 *       name: user.name,
 *       image: user.picture,
 *     });
 *
 *     // Redirect ke frontend dengan tokens
 *     res.redirect(
 *       `${process.env.FRONTEND_URL}/auth/callback?` +
 *       `accessToken=${authResult.accessToken}&` +
 *       `refreshToken=${authResult.refreshToken}`
 *     );
 *   } catch (error) {
 *     res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
 *   }
 * }
 */


