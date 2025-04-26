export type SubBang = {
    b: string; // the bang

    k?: string; // the key in the bang url
    u?: string; // url query param

    l: number; // the length of its query, -1 is until next bang

    v?: string; // value if its toggleable
    d?: string; // default value
};

export type Bang = {
    c?: string; // catagory
    d: string; // home page 
    r: number; // rank
    s: string; // search name
    sc?: string; // subCatagory
    t: string; // the bang
    u: string; // the url
    sb: SubBang[]; // SubBangs
};
