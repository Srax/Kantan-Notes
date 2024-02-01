import CryptoES from "crypto-es";
import SecureStore from "./store";
import { Base64 } from "crypto-es/lib/enc-base64";

const iv = CryptoES.lib.WordArray.random(128 / 8); // Initialization vector
const SECURE_KEY = "SECURE-KEY";

const encryptData = async (data: string): Promise<string | Error> => {
  try {
    const key = await getEncryptionKey();

    if (!key) {
      throw new Error("Encryption key is null or undefined");
    }

    const encrypted = await CryptoES.AES.encrypt(data, key, { iv: iv });
    return encrypted.toString();
  } catch (error: any) {
    console.error("Encryption error:", error);
    return error; // Return the error for handling elsewhere
  }
};

const decryptData = async (encryptedData: any): Promise<string | Error> => {
  try {
    const key = await getEncryptionKey();

    if (!key) {
      throw new Error("Decryption key is null or undefined");
    }

    const decrypted = await CryptoES.AES.decrypt(encryptedData, key, {
      iv: iv,
    });
    return decrypted.toString(CryptoES.enc.Utf8);
  } catch (error: any) {
    console.error("Decryption error:", error);
    return error; // Return the error for handling elsewhere
  }
};

const getEncryptionKey = async () => {
  try {
    const key = await SecureStore.retrieve(SECURE_KEY);

    if (key) {
      return key;
    } else {
      const _newKey = await CryptoES.lib.WordArray.random(256 / 8).toString(
        CryptoES.enc.Base64
      );
      await SecureStore.store(SECURE_KEY, _newKey);
      const newKey = await SecureStore.retrieve(SECURE_KEY);
      return newKey;
    }
  } catch (error) {
    console.error("Error generating token:", error);
    throw error; // Or handle errors appropriately
  }
};

const Cipher = {
  encryptData,
  decryptData,
  getEncryptionKey,
};

export default Cipher;
