/* lib/validations/auth/validators/address_validators.ts */

export function isValidUF(uf: string): boolean {
    const validUFs = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
        'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
        'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    return validUFs.includes(uf.toUpperCase());
};

export function isValidZipCode(cep: string): boolean {
    const zipCodeClean = cep.replace(/\D/g, "")

    return zipCodeClean.length === 8;
};