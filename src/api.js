import axios from 'axios';

// FlaskバックエンドのAPIエンドポイント
export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const API_URL = `${BASE_URL}/api/influencers`;
export const UPLOAD_API_URL = `${BASE_URL}/api/upload_influencers`;
export const CHECK_LOGIN_URL = `${BASE_URL}/api/check_login`;
export const LOGOUT_URL = `${BASE_URL}/api/logout`;

// Axiosインスタンスの作成 (withCredentials を常に有効にする)
export const api = axios.create({
  withCredentials: true, // クッキーを自動的に送受信
});