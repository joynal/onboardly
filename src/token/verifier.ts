import * as jose from 'jose';
import * as constant from './constant';
import { err, ok } from '../utils/result';
import { DecryptOptions, Options, Payload } from './types';

export const verifyJwe = async <T extends Payload>(token: string, options: DecryptOptions) => {
    try {
        const alg = constant.SIGN_ALGORITHM_KEY_PAIR;
        const encryptKey = Buffer.from(options.encryptKey ?? '', 'hex');
        const publicKey = await jose.importSPKI(options.publicKey, alg);

        const { plaintext } = await jose.compactDecrypt(token, encryptKey);

        const raw = await jose.jwtVerify(plaintext, publicKey, {
            issuer: constant.ISSUER,
        });

        return ok(raw.payload as T);
    } catch (error) {
        return err([String(error)]);
    }
};

export const verifyJwt = async <T extends Payload>(token: string, options: Options) => {
    try {
        const encoder = new TextEncoder();
        const raw = await jose.jwtVerify(token, encoder.encode(options.signKey), {
            issuer: constant.ISSUER,
        });

        return ok(raw.payload as T);
    } catch (error) {
        return err([String(error)]);
    }
};
