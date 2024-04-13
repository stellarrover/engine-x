import fetch from 'node-fetch';
import { SocialLoginType } from '../models/social-oauth.model';

export interface SocialConfig {
  appId: string;
  appSecret: string;
  redirectUrl: string;
}

export interface SocialUser {
  provider: SocialLoginType;
  openId: string;
  nickname: string;
  avatar: string;
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresIn: number;
  email?: string;
}

export interface SocialTokenInfo {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  openId?: string;
  idToken?: string;
}

export interface SocialInterface {
  getUser(code: string): Promise<SocialUser>;
  getRedirectUrl(): string;
  getAccessToken(code: string): Promise<SocialTokenInfo>;
}

export class SocialiteManager {
  constructor(
    private config: { [key in keyof typeof SocialLoginType]: SocialConfig },
  ) {}

  private async getAccessToken(
    type: SocialLoginType,
    code: string,
  ): Promise<SocialTokenInfo> {
    let params: URLSearchParams = new URLSearchParams({
      client_id: this.config[type].appId,
      client_secret: this.config[type].appSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.config[type].redirectUrl,
    });

    switch (type) {
      case SocialLoginType.GOOGLE:
        return fetch(`https://oauth2.googleapis.com/token?${params}`, {
          method: 'POST',
          headers: { accept: 'application/json' },
        })
          .then((res) => res.json())
          .then((data) => ({
            accessToken: data.access_token,
            expiresIn: data.expires_in,
            refreshToken: data.refresh_token,
            idToken: data.id_token,
          }));

      case SocialLoginType.FACEBOOK:
        params = new URLSearchParams({
          client_id: this.config[type].appId,
          client_secret: this.config[type].appSecret,
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.config[type].redirectUrl,
        });
        return fetch(
          `https://graph.facebook.com/v6.0/oauth/access_token?${params}`,
          {
            method: 'POST',
            headers: { accept: 'application/json' },
          },
        )
          .then((res) => res.json())
          .then((data) => ({
            accessToken: data.access_token,
            expiresIn: data.expires_in,
            refreshToken: data.refresh_token,
            openId: data.openid,
          }));

      case SocialLoginType.TWITTER:
        return fetch(`https://api.twitter.com/oauth/access_token?${params}`, {
          method: 'POST',
          headers: { accept: 'application/json' },
        })
          .then((res) => res.json())
          .then((data) => ({
            accessToken: data.access_token,
            expiresIn: data.expires_in,
            refreshToken: data.refresh_token,
            openId: data.openid,
          }));

      case SocialLoginType.LINKEDIN:
        return;

      case SocialLoginType.GITHUB:
        return;

      case SocialLoginType.AMAZON:
        return;

      case SocialLoginType.MICROSOFT:
        return;

      case SocialLoginType.APPLE:
        return;

      case SocialLoginType.INSTAGRAM:
        return fetch(`https://api.instagram.com/oauth/access_token?${params}`, {
          method: 'POST',
          headers: { accept: 'application/json' },
        })
          .then((res) => res.json())
          .then((data) => ({
            accessToken: data.access_token,
            expiresIn: data.expires_in,
            refreshToken: data.refresh_token,
            openId: data.openid,
          }));

      case SocialLoginType.TIKTOK:
        return;

      case SocialLoginType.QQ:
        return fetch(`https://graph.qq.com/oauth2.0/token?${params}`, {
          method: 'GET',
          headers: { accept: 'application/json' },
        })
          .then(async (res) => {
            const result = await res.text();
            const json = Object.fromEntries(new URLSearchParams(result));
            if (res.status === 200) return json as any;
          })
          .then(async (json) => {
            const result = await fetch(
              `https://graph.qq.com/oauth2.0/me?access_token=${json.access_token}&fmt=json`,
            );
            const { openid } = await result.json();
            return { ...json, openid };
          })
          .then((data) => ({
            accessToken: data.access_token,
            expiresIn: +data.expires_in,
            refreshToken: data.refresh_token,
            openId: data.openid,
          }));

      case SocialLoginType.WEIBO:
        return fetch(`https://api.weibo.com/oauth2/access_token?${params}`, {
          method: 'POST',
          headers: { accept: 'application/json' },
        })
          .then(async (res) => {
            if (res.status === 200) return res.json();
            throw new Error(await res.text());
          })
          .then((data) => {
            return {
              accessToken: data.access_token,
              expiresIn: data.expires_in,
              refreshToken: data.refresh_token ?? '',
              openId: data.uid,
            };
          });

      case SocialLoginType.WECHAT:
        return fetch(
          `https://api.weixin.qq.com/sns/oauth2/access_token?${params}`,
          {
            method: 'POST',
            headers: { accept: 'application/json' },
          },
        )
          .then((res) => res.json())
          .then((data) => ({
            accessToken: data.access_token,
            expiresIn: data.expires_in,
            refreshToken: data.refresh_token,
            openId: data.openid,
          }));
      default:
        throw new Error(`Invalid social type: ${type}`);
    }
  }

  private getRedirectUrl(type: SocialLoginType) {
    let params: URLSearchParams;

    switch (type) {
      case SocialLoginType.GOOGLE:
        params = new URLSearchParams({
          client_id: this.config[type].appId,
          redirect_uri: this.config[type].redirectUrl,
          response_type: 'code',
          scope:
            'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        });
        return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
      case SocialLoginType.FACEBOOK:
        params = new URLSearchParams({
          client_id: this.config[type].appId,
          redirect_uri: this.config[type].redirectUrl,
          response_type: 'code',
          scope: 'email',
        });
        return `https://www.facebook.com/v6.0/dialog/oauth?${params}`;
      case SocialLoginType.TWITTER:
        params = new URLSearchParams({
          client_id: this.config[type].appId,
          redirect_uri: this.config[type].redirectUrl,
          response_type: 'code',
        });
        return `https://api.twitter.com/oauth/authenticate?${params}`;
      case SocialLoginType.LINKEDIN:
        return;
      case SocialLoginType.GITHUB:
        return;
      case SocialLoginType.AMAZON:
        return;
      case SocialLoginType.MICROSOFT:
        return;
      case SocialLoginType.APPLE:
        return;
      case SocialLoginType.INSTAGRAM:
        params = new URLSearchParams({
          client_id: this.config[type].appId,
          redirect_uri: this.config[type].redirectUrl,
          response_type: 'code',
        });
        return `https://api.instagram.com/oauth/authorize?${params}`;
      case SocialLoginType.TIKTOK:
        return;
      case SocialLoginType.QQ:
        params = new URLSearchParams({
          client_id: this.config[type].appId,
          redirect_uri: this.config[type].redirectUrl,
          response_type: 'code',
        });
        return `https://graph.qq.com/oauth2.0/authorize?${params}`;
      case SocialLoginType.WEIBO:
        params = new URLSearchParams({
          client_id: this.config[type].appId,
          redirect_uri: this.config[type].redirectUrl,
          response_type: 'code',
        });
        return `https://api.weibo.com/oauth2/authorize?${params}`;
      case SocialLoginType.WECHAT:
        params = new URLSearchParams({
          appid: this.config[type].appId,
          redirect_uri: this.config[type].redirectUrl,
          response_type: 'code',
          scope: 'snsapi_login',
        });
        return `https://open.weixin.qq.com/connect/qrconnect?${params}`;
      default:
        throw new Error(`Invalid social type: ${type}`);
    }
  }

  private async getUser(type: SocialLoginType, code: string) {
    const accessToken = await this.getAccessToken(type, code);
    let params: URLSearchParams;

    switch (type) {
      case SocialLoginType.GOOGLE:
        return fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${accessToken.idToken}`,
        )
          .then((res) => res.json())
          .then((data) => ({
            openId: data.sub,
            email: data.email,
            nickname: data.name,
            avatar: data.picture,
            accessToken: accessToken.accessToken,
            refreshToken: accessToken.refreshToken,
            expiresIn: accessToken.expiresIn,
            provider: type,
          }));

      case SocialLoginType.FACEBOOK:
        params = new URLSearchParams({
          access_token: accessToken.accessToken,
          fields: 'id,name,picture',
        });
        return fetch(`https://graph.facebook.com/v6.0/me?${params}`)
          .then((res) => res.json())
          .then((data) => ({
            openId: accessToken.openId!,
            nickname: data.name,
            avatar: data.picture.data.url,
            accessToken: accessToken.accessToken,
            refreshToken: accessToken.refreshToken,
            expiresIn: accessToken.expiresIn,
            provider: type,
          }));

      case SocialLoginType.TWITTER:
        params = new URLSearchParams({
          oauth_verifier: code,
        });
        return fetch(`https://api.twitter.com/oauth/access_token?${params}`)
          .then((res) => res.json())
          .then((data) => ({
            openId: accessToken.openId!,
            nickname: data.screen_name,
            avatar: data.profile_image_url_https,
            accessToken: accessToken.accessToken,
            refreshToken: accessToken.refreshToken,
            expiresIn: accessToken.expiresIn,
            provider: type,
          }));

      case SocialLoginType.LINKEDIN:
        return;

      case SocialLoginType.GITHUB:
        return;

      case SocialLoginType.AMAZON:
        return;

      case SocialLoginType.MICROSOFT:
        return;

      case SocialLoginType.APPLE:
        return;

      case SocialLoginType.INSTAGRAM:
        params = new URLSearchParams({
          access_token: accessToken.accessToken,
          fields: 'id,name,picture',
        });
        return fetch(`https://graph.facebook.com/v6.0/me?${params}`)
          .then((res) => res.json())
          .then((data) => ({
            openId: accessToken.openId!,
            nickname: data.name,
            avatar: data.picture.data.url,
            accessToken: accessToken.accessToken,
            refreshToken: accessToken.refreshToken,
            expiresIn: accessToken.expiresIn,
            provider: type,
          }));

      case SocialLoginType.TIKTOK:
        return;

      case SocialLoginType.QQ:
        params = new URLSearchParams({
          access_token: accessToken.accessToken,
          oauth_consumer_key: this.config[type].appId,
          openid: accessToken.openId!,
        });
        return await fetch(`https://graph.qq.com/user/get_user_info?${params}`)
          .then((res) => res.json())
          .then((data) => ({
            openId: accessToken.openId!,
            nickname: data.nickname,
            avatar: data.figureurl_qq_2 ?? data.figureurl_qq_1,
            accessToken: accessToken.accessToken,
            refreshToken: accessToken.refreshToken,
            expiresIn: accessToken.expiresIn,
            provider: type,
          }));

      case SocialLoginType.WEIBO:
        params = new URLSearchParams({
          access_token: accessToken.accessToken,
          uid: accessToken.openId!,
        });
        return fetch(`https://api.weibo.com/2/users/show.json?${params}`)
          .then((res) => res.json())
          .then((data) => ({
            openId: accessToken.openId!,
            nickname: data.screen_name,
            avatar: data.avatar_large,
            accessToken: accessToken.accessToken,
            refreshToken: accessToken.refreshToken,
            expiresIn: accessToken.expiresIn,
            provider: type,
          }));

      case SocialLoginType.WECHAT:
        params = new URLSearchParams({
          access_token: accessToken.accessToken,
          openid: accessToken.openId!,
        });
        return fetch(`https://api.weixin.qq.com/sns/userinfo?${params}`)
          .then((res) => res.json())
          .then((data) => ({
            openId: accessToken.openId!,
            nickname: data.nickname,
            avatar: data.headimgurl,
            accessToken: accessToken.accessToken,
            refreshToken: accessToken.refreshToken,
            expiresIn: accessToken.expiresIn,
            provider: type,
          }));
      default:
        throw new Error(`Invalid social type: ${type}`);
    }
  }

  get(type: SocialLoginType): SocialInterface {
    return {
      getAccessToken: (code: string) => this.getAccessToken(type, code),
      getRedirectUrl: () => this.getRedirectUrl(type),
      getUser: async (code: string) => {
        return this.getUser(type, code);
      },
    };
  }
}

export const socialManager = new SocialiteManager({} as any);
