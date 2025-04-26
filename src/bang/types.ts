export type SubBang = {
    b: string; // the bang

    k?: string; // the key in the bang url
    u?: string; // url query param
    ls?: string; // localStorage key

    l: number; // the length of its query, -1 is until next bang

    v?: string; // value if its toggleable
    d?: string; // default value
};

export type Bang = {
    c?: string; // catagory
    d: string;
    r: number;
    s: string;
    sc?: string; // subCatagory
    t: string;
    u: string;
    sb: SubBang[]; // SubBangs
};
