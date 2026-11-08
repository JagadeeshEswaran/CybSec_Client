
    export type RemoteKeys = 'mfeSecurityWorkspace/Workspace';
    type PackageType<T> = T extends 'mfeSecurityWorkspace/Workspace' ? typeof import('mfeSecurityWorkspace/Workspace') :any;