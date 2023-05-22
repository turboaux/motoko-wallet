import { AuthClientCreateOptions, AuthClientLoginOptions,  IdleOptions } from "@dfinity/auth-client";

export const createOptions: AuthClientCreateOptions = {
    idleOptions : { disableIdle: true, disableDefaultIdleCallback: true } as IdleOptions,
};

export const loginOptions: AuthClientLoginOptions = {
    identityProvider: 'https://identity.ic0.app/#authorize',  
    // Maximum authorization expiration is 7 days
    maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000)
};