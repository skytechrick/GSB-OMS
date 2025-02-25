import z from 'zod';

export const loginSchema = z.object({
    email: z.string().email().max(255).transform(str => str.toLowerCase()),
    password: z.string().min(8).max(255),
});


export const createRegionalOfficeSchema = z.object({
    regionalOfficeName: z.string().min(4).max(255),
    officialEmail: z.string().email().transform(str => str.toLowerCase()),
    address: z.object({
        address_line: z.string().min(3).max(255),
        pinCode: z.string().max(6).min(6),
        district: z.string().min(3).max(255),
        city: z.string().min(3).max(255),
        country: z.string().min(4).max(255),
        state: z.string().min(3).max(255),
    }),
});

export const createRegionalOfficerSchema = z.object({
    regionalOfficeId: z.string().min(24).max(24),
    personalDetails: z.object({
        firstName: z.string().min(3).max(255),
        lastName: z.string().min(3).max(255).optional(),
        mobileNumber: z.string().min(10).max(10).optional(),
        dob: z.string().max(255).optional(),
        gender: z.string().min(4).max(6).optional(),
    }),
    email: z.string().email().transform(str => str.toLowerCase()),
    role: z.string().min(4).max(255).optional(),
    address: z.object({
        address_line: z.string().min(3).max(255),
        pinCode: z.string().max(6).min(6),
        district: z.string().min(3).max(255),
        city: z.string().min(3).max(255),
        country: z.string().min(4).max(255),
        state: z.string().min(3).max(255),
    }),

});

export const createBranchSchema = z.object({
    branchName: z.string().min(4).max(255),
    branchEmail: z.string().email().transform(str => str.toLowerCase()),
    address: z.object({
        address_line: z.string().min(3).max(255),
        pinCode: z.string().max(6).min(6),
        district: z.string().min(3).max(255),
        city: z.string().min(3).max(255),
        country: z.string().min(4).max(255),
        state: z.string().min(3).max(255),
    }),
});


export const createBranchManagerSchema = z.object({
    branchId: z.string().min(24).max(24),
    personalDetails: z.object({
        firstName: z.string().min(3).max(255),
        lastName: z.string().min(3).max(255).optional(),
        mobileNumber: z.string().min(10).max(10).optional(),
        dob: z.string().max(255).optional(),
        gender: z.string().min(4).max(6).optional(),
    }),
    email: z.string().email().transform(str => str.toLowerCase()),
    role: z.string().min(4).max(255).optional(),
    address: z.object({
        address_line: z.string().min(3).max(255),
        pinCode: z.string().max(6).min(6),
        district: z.string().min(3).max(255),
        city: z.string().min(3).max(255),
        country: z.string().min(4).max(255),
        state: z.string().min(3).max(255),
    }),
});

export const createSupportOfficeSchema = z.object({
    supportOfficeName: z.string().min(4).max(255),
    supportOfficeEmail: z.string().email().transform(str => str.toLowerCase()),
    address: z.object({
        address_line: z.string().min(3).max(255),
        pinCode: z.string().max(6).min(6),
        district: z.string().min(3).max(255),
        city: z.string().min(3).max(255),
        country: z.string().min(4).max(255),
        state: z.string().min(3).max(255),
    }),
});

export const createSupportManagerSchema = z.object({
    supportOfficeId: z.string().min(24).max(24),
    personalDetails: z.object({
        firstName: z.string().min(3).max(255),
        lastName: z.string().min(3).max(255).optional(),
        mobileNumber: z.string().min(10).max(10).optional(),
        dob: z.string().max(255).optional(),
        gender: z.string().min(4).max(6).optional(),
    }),
    email: z.string().email().transform(str => str.toLowerCase()),
    role: z.string().min(4).max(255).optional(),
    address: z.object({
        address_line: z.string().min(3).max(255),
        pinCode: z.string().max(6).min(6),
        district: z.string().min(3).max(255),
        city: z.string().min(3).max(255),
        country: z.string().min(4).max(255),
        state: z.string().min(3).max(255),
    }),
});

export const createSupportAssistantSchema = z.object({
    supportOfficeId: z.string().min(24).max(24),
    personalDetails: z.object({
        firstName: z.string().min(3).max(255),
        lastName: z.string().min(3).max(255).optional(),
        mobileNumber: z.string().min(10).max(10).optional(),
        dob: z.string().max(255).optional(),
        gender: z.string().min(4).max(6).optional(),
    }),
    email: z.string().email().transform(str => str.toLowerCase()),
    role: z.string().min(4).max(255).optional(),
    address: z.object({
        address_line: z.string().min(3).max(255),
        pinCode: z.string().max(6).min(6),
        district: z.string().min(3).max(255),
        city: z.string().min(3).max(255),
        country: z.string().min(4).max(255),
        state: z.string().min(3).max(255),
    }),
});
export const createDeliveryAgentSchema = z.object({
    supportOfficeId: z.string().min(24).max(24),
    personalDetails: z.object({
        firstName: z.string().min(3).max(255),
        lastName: z.string().min(3).max(255).optional(),
        mobileNumber: z.string().min(10).max(10).optional(),
        dob: z.string().max(255).optional(),
        gender: z.string().min(4).max(6).optional(),
    }),
    email: z.string().email().transform(str => str.toLowerCase()),
    role: z.string().min(4).max(255).optional(),
    address: z.object({
        address_line: z.string().min(3).max(255),
        pinCode: z.string().max(6).min(6),
        district: z.string().min(3).max(255),
        city: z.string().min(3).max(255),
        country: z.string().min(4).max(255),
        state: z.string().min(3).max(255),
    }),
});

export const createSellerSchema = z.object({
    personalDetails: z.object({
        name: z.string().min(3).max(255),
        dob: z.string().max(255),
        mobileNumber: z.string().min(10).max(10),
        altMobileNumber: z.string().min(10).max(10),
        gender: z.string().min(4).max(6),
    }),
    categories: z.array(z.string()),
    email: z.string().email(),
    shopDetails: z.object({
        shopName: z.string(),
        shopAddress: z.string().url(),
        shopContact: z.string().min(10).max(10),
    }),
    bankAccount: z.object({
        bankName: z.string(),
        beneficiaryName: z.string(),
        accountNumber: z.string(),
        ifscCode: z.string()
    }),
    documents: z.object({
        panId: z.string(),
        aadhaarId: z.string() 
    }),
    address: z.object({
        address_line: z.string().min(3).max(255),
        pinCode: z.string().max(6).min(6),
        district: z.string().min(3).max(255),
        city: z.string().min(3).max(255),
        state: z.string().min(3).max(255),
        country: z.string().min(4).max(255),
    }),
});

export const createProductSchema = z.object({
    sellerId: z.string().min(24).max(24),
    category: z.string().min(3).max(255),
    subCategory: z.string().min(3).max(255),
    title: z.string().min(3).max(255),
    description: z.string().min(3).max(5000),
    variants: z.string(),
    // variants: z.array(z.object({
        // option: z.string().min(1).max(255),
        // availableQuantity: z.string().min(1).max(255),
    // })),
    specificationTable: z.string(),
    // specificationTable: z.array(z.object({
    //     key: z.string().min(1).max(255),
    //     value: z.string().min(1).max(2000),
    // })),
    keywords: z.string().min(3).max(255),
    mrp: z.string(),
    sellerPrice: z.string(),
    localDelivery: z.string(),
    defaultDelivery: z.string(),
    videos: z.string(),
    gender: z.string().min(3).max(255),
    ageGroup: z.string().min(3).max(255),
});