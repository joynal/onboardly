export type Expiration = number | string;

export type Payload = {
    meta?: { issuer: string };
    [key: string]: unknown;
};

export type Options = {
    signKey: string;
};

type EncryptBase = {
    encryptKey: string;
};

export type EncryptOptions = EncryptBase & {
    privateKey: string;
};

export type DecryptOptions = EncryptBase & {
    publicKey: string;
};

export type TokenIssuingOptions = Options & {
    expiresIn: Expiration;
};

export type IssueTokenWithEncryption = EncryptOptions & {
    expiresIn: Expiration;
};
