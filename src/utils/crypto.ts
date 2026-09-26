
import CryptoJS from 'crypto-js'

// 十六位十六进制数作为密钥
const SECRET_KEY = CryptoJS.enc.Utf8.parse('QUXDkfNmj8ZZF4AS')

const KEY = CryptoJS.enc.Utf8.parse('194128159126315710331411')

const IV = CryptoJS.enc.Utf8.parse('5159138471223941')


/**
 * 加密方法
 * @param data
 * @returns {string}
 */
export function encryptByKeyAndIv(data: object | string) {
  let targetStr = ''
  if (typeof data === 'object') {
    try {
      // eslint-disable-next-line no-param-reassign
      targetStr = JSON.stringify(data)
    } catch (error) {
      console.log('encrypt error:', error)
    }
  } else {
    targetStr = data
  }
  const encrypted = CryptoJS.AES.encrypt(targetStr, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}


/**
 * 加密方法
 * @param data
 * @returns {string}
 */
export function encrypt(data: object | string) {
  let targetStr = ''
  if (typeof data === 'object') {
    try {
      // eslint-disable-next-line no-param-reassign
      targetStr = JSON.stringify(data)
    } catch (error) {
      console.log('encrypt error:', error)
    }
  } else {
    targetStr = data
  }
  const dataHex = CryptoJS.enc.Utf8.parse(targetStr)
  const encrypted = CryptoJS.AES.encrypt(dataHex, SECRET_KEY, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.ciphertext.toString()
}

/**
 * 解密方法
 * @param data
 * @returns {string}
 */
export function decrypt(data: string) {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(data)
  const str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  const decryptTarget = CryptoJS.AES.decrypt(str, SECRET_KEY, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  const decryptedStr = decryptTarget.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}

