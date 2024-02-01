import * as ExpoSecureStore from "expo-secure-store";

const SECURE_KEY = "secure-key";

const store = async (key: string, value: string) => {
  try {
    // More about options:
    // https://docs.expo.io/versions/latest/sdk/securestore/#securestoresetitemasynckey-value-options
    const options = { keychainAccessible: ExpoSecureStore.WHEN_UNLOCKED };
    ExpoSecureStore.setItemAsync(key, value, options);
  } catch (error) {
    throw Error(`Unable to securely store data.`);
  }
};

const retrieve = async (key: string) => {
  return await ExpoSecureStore.getItemAsync(key);
};

const remove = async (key: string) => {
  return await ExpoSecureStore.deleteItemAsync(key);
};

// const storeData = async (key: string, value: string, securely: boolean) => {
//     try {
//       if (securely) {
//         // More about options:
//         // https://docs.expo.io/versions/latest/sdk/securestore/#securestoresetitemasynckey-value-options
//         const options = { keychainAccessible: ExpoSecureStore.WHEN_UNLOCKED };
//         await ExpoSecureStore.setItemAsync(key, value, options);
//       } else {
//         await AsyncStore.setItem(key, value);
//       }
//     } catch (error) {
//       throw Error(`Unable to ${securely ? "securely" : ""} store data.`);
//     }
//   };

// const generateToken = async () => {
//   try {
//     const iv = CryptoES.lib.PasswordBasedCipher. // Initialization vector
//     const token = await Random.getRandomBytesAsync(32); // Adjust length as needed
//     return token.toString("base64"); // Convert to a string for storage
//   } catch (error) {
//     console.error("Error generating token:", error);
//     return null; // Handle errors appropriately
//   }
// };

const SecureStore = {
  store,
  retrieve,
  remove,
};

export default SecureStore;
