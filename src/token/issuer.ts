import * as jose from 'jose';
import * as constant from './constant';
import { Payload, IssueTokenWithEncryption, TokenIssuingOptions } from './types';
import { ok } from '../utils/result';

export const issueJwe = async (payload: Payload, options: IssueTokenWithEncryption) => {
    const alg = constant.SIGN_ALGORITHM_KEY_PAIR;
    const privateKey = await jose.importPKCS8(options.privateKey, alg);

    const jws = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg })
        .setIssuer(constant.ISSUER)
        .setIssuedAt()
        .setExpirationTime(options.expiresIn)
        .sign(privateKey);

    const encoder = new TextEncoder();
    const encryptKey = Buffer.from(options.encryptKey ?? '', 'hex');
    const token = await new jose.CompactEncrypt(encoder.encode(jws))
        .setProtectedHeader({ alg: 'dir', enc: constant.ENCRYPTION_ALGORITHM })
        .encrypt(encryptKey);

    return ok(token);
};

export const issueJwt = async (payload: Payload, options: TokenIssuingOptions) => {
    const encoder = new TextEncoder();

    const token = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: constant.SIGN_ALGORITHM })
        .setIssuer(constant.ISSUER)
        .setIssuedAt()
        .setExpirationTime(options.expiresIn)
        .sign(encoder.encode(options.signKey));

    return ok(token);
};
