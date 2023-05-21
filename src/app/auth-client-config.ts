import { AuthClientCreateOptions, AuthClientLoginOptions,  IdleOptions } from "@dfinity/auth-client";
import { environment } from '@env/environment';

export const createOptions: AuthClientCreateOptions = {
    idleOptions : { disableIdle: true } as IdleOptions
};

export const loginOptions: AuthClientLoginOptions = {
    identityProvider: 'https://identity.ic0.app/#authorize',  
    // Maximum authorization expiration is 8 days
    maxTimeToLive: BigInt(1) * BigInt(24) * BigInt(3600000000000)
};