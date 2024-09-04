export class validationPatterns{
    static readonly alphanumeric = /^[a-zA-Z0-9 ]{1,50}$/ ;
    static readonly alpha = /^[a-zA-Z ]{1,50}$/;
    static readonly numeric = /^[0-9]$/;
    static readonly capsaAlpha = /^[A-Z ]$/;
}

export class apiUrls{
    static readonly baseUrl="https://localhost:7009/api/";
}