declare let _DEV_: boolean;
declare let _VERSION_: string;

// semver版本规范：1.0.1
declare type T_piuVersion = string;

// piu坐标：piuname + @ + version => 'piuTest@1.2.0'
declare type T_piuPosition = string;

declare interface I_Piu_Option {
    config: {
        base: string;
        [key: string]: string | number;
    };
    deps: {
        [piuName: string]: T_piuVersion
    };
    assets: string[];
}

declare interface I_Piu_Define {
    name: string;
    version: T_piuVersion;
    option: I_Piu_Option;
}

declare interface I_Piu {
    attach: (piu: I_Piu_Define, handler: {[eName: string]: (val: any) => Record<string, unknown>} | any) => void;
    emit: (event: string, val: any) => void;
    setup: (data:{[name: string]: {[value:string]: any}}) => void;
    set: (name: string, value: any) => void;
    get: (name: string) => any;
}

declare interface window {
    crypto: {
        randomUUID: () => string;
    };
    FileReaderSync: any;
    Prel: {
        autoLoad: (piuObj: {[piuName: string]: T_piuVersion}) => void;
        define: (piuDefineObj: {[piuposition: T_piuPosition]: I_Piu_Define}) => I_Piu_Define;
        assets: () => {[piuposition: T_piuPosition]: I_Piu_Option};
        domReady: (fn: () => void) => void;
        start: (
            name: string,
            version: string,
            deps: string[],
            init: (piuinstall: I_Piu, args: any) => Promise<any> | any,
            bootstrap?:(piu : I_Piu) => void,
        ) => void;
        ready: (fn: () => void) => void;
    };
    themeFix: boolean;
}
