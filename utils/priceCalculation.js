
const customRound = (num) => {
    num = Math.ceil(num);

    const unitPlace = num % 10;

    if (unitPlace >= 5 && unitPlace <= 9) {
        return num - unitPlace + 9;
    } else if (unitPlace >= 1 && unitPlace < 5) {
        return num - unitPlace + 5;
    } else if (unitPlace === 0) {
        return num - 1;
    }
}

const platformCommission = 6.31;
const razorpayCharge = 2.36;
const averagePackagingCharge = 11.00;
const averageLocalDeliveryCharge = 31.00;
const averageAnywhereDeliveryCharge = 65.00;

// const commissionCharge = (platformCommission / 100) * sellerPrice;
// const localSubTotalPrice = sellerPrice + averageLocalDeliveryCharge + averagePackagingCharge;
// const afterCommission = localSubTotalPrice + commissionCharge;
// const afterRazorpayCharge = afterCommission/(1 - (razorpayCharge / 100));
export const localDeliveryPriceCalculation = (sellerPrice) => {
    
    const sent = (sellerPrice + averageLocalDeliveryCharge + averagePackagingCharge + ((platformCommission / 100) * sellerPrice)) / (1 - (razorpayCharge / 100))

    return customRound(sent);

};

export const anywhereDeliveryPriceCalculation = (sellerPrice) => {

    const sent = (sellerPrice + averageAnywhereDeliveryCharge + averagePackagingCharge + ((platformCommission / 100) * sellerPrice)) / (1 - (razorpayCharge / 100))

    return customRound(sent);

};
