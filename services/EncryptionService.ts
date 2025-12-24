/**
 * 暗号化サービス
 * Web Crypto APIを使用した暗号化・復号化
 */

export interface EncryptedData {
  data: string;
  iv: string;
}

export class EncryptionService {
  private static instance: EncryptionService;
  private readonly algorithm = 'AES-GCM';
  private readonly keyLength = 256;
  private cryptoKey: CryptoKey | null = null;

  private constructor() {}

  /**
   * シングルトンインスタンスの取得
   */
  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  /**
   * 暗号化キーの生成
   */
  private async generateKey(): Promise<CryptoKey> {
    if (this.cryptoKey) {
      return this.cryptoKey;
    }

    // ブラウザ固有の情報から決定的なキーを生成
    const browserInfo = navigator.userAgent + navigator.language + screen.width;
    const encoder = new TextEncoder();
    const keyMaterial = encoder.encode(browserInfo);
    
    // PBKDF2でキーを導出
    const importedKey = await window.crypto.subtle.importKey(
      'raw',
      keyMaterial,
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    this.cryptoKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('invoice-creator-salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      importedKey,
      { name: this.algorithm, length: this.keyLength },
      false,
      ['encrypt', 'decrypt']
    );

    return this.cryptoKey;
  }

  /**
   * データの暗号化
   */
  async encrypt(text: string): Promise<EncryptedData> {
    try {
      const key = await this.generateKey();
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      const encrypted = await window.crypto.subtle.encrypt(
        { name: this.algorithm, iv },
        key,
        data
      );

      return {
        data: this.arrayBufferToBase64(encrypted),
        iv: this.arrayBufferToBase64(iv.buffer)
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('暗号化に失敗しました');
    }
  }

  /**
   * データの復号化
   */
  async decrypt(encryptedData: EncryptedData): Promise<string> {
    try {
      const key = await this.generateKey();
      const data = this.base64ToArrayBuffer(encryptedData.data);
      const iv = this.base64ToArrayBuffer(encryptedData.iv);

      const decrypted = await window.crypto.subtle.decrypt(
        { name: this.algorithm, iv },
        key,
        data
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('復号化に失敗しました');
    }
  }

  /**
   * ArrayBufferをBase64に変換
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Base64をArrayBufferに変換
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * 簡易暗号化（フォールバック用）
   */
  simpleEncrypt(text: string): string {
    return btoa(encodeURIComponent(text));
  }

  /**
   * 簡易復号化（フォールバック用）
   */
  simpleDecrypt(encrypted: string): string {
    return decodeURIComponent(atob(encrypted));
  }
}
