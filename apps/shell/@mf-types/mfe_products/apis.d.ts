
    export type RemoteKeys = 'mfe_products/ProductsPage';
    type PackageType<T> = T extends 'mfe_products/ProductsPage' ? typeof import('mfe_products/ProductsPage') :any;