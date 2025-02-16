import z from 'zod';

export const loginSchema = z.object({
    email: z.string().email().max(255),
    password: z.string().min(8).max(255),
});


export const createRegionalOfficeSchema = z.object({
    regionalOfficeName: z.string().min(4).max(255),
    officialEmail: z.string().email(),
    address: z.object({
        address_line: z.string().min(3).max(255),
        pinCode: z.string().max(6).min(6),
        district: z.string().min(3).max(255),
        city: z.string().min(3).max(255),
        country: z.string().min(4).max(255),
        state: z.string().min(3).max(255),
    }),
});
