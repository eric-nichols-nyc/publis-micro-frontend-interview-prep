
    export type RemoteKeys = 'mfe_cart/CartWidget';
    type PackageType<T> = T extends 'mfe_cart/CartWidget' ? typeof import('mfe_cart/CartWidget') :any;