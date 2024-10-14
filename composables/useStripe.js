import { loadStripe } from "@stripe/stripe-js";

export default function useStripe() {
    const config = useRuntimeConfig();
    const stripe = useState("stripe-client", () => null);

    async function _loadStripe(key, options) {
        const _key = key || config.public.STRIPE_PUBLIC_KEY;
        const _options = options || config.public.STRIPE_OPTIONS;

        if (!stripe.value) {
            stripe.value = await loadStripe(_key, _options);
        }

        return stripe.value;
    }


    return {
        stripe,
        loadStripe: _loadStripe
    }
}