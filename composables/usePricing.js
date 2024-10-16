export default function usePricing() {
    const pricing = {
        'PRICING_FREE': { cost: 0, label: 'Free' },
        'PRICING_SMALL': { cost: 1000, label: 'Small' },
        'PRICING_MEDIUM': { cost: 2500, label: 'Medium' },
        'PRICING_LARGE': { cost: 5000, label: 'Large' },
    }

    // In cents!
    function getPricingCost(pricingType) {
        return pricing[pricingType]?.cost ?? 0
    }

    function getPricingLabel(pricingType) {
        return pricing[pricingType]?.label ?? 'Unknown'
    }

    return {
        pricing,
        getPricingCost,
        getPricingLabel
    }
}