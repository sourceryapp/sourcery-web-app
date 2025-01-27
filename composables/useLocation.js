export default function useLocation() {
    const config = useRuntimeConfig();
    const location = useState('location', () => {
        return null
    })
    const accuracy = ref(0)
    const locationCollected = ref(false)
    const locationError = ref(null)
    const popularLocations = {
        'New York, NY': { lat: 40.7128, lng: -74.0060 },
        'Boston, MA': { lat: 42.3601, lng: -71.0589 },
        'Washington D.C.': { lat: 38.9072, lng: -77.0369 },
        'Storrs, CT': { lat: 41.8077, lng: -72.2503 },
    }

    function getUserLocation() {
        if ( navigator.geolocation ) {
            locationError.value = false
            navigator.geolocation.getCurrentPosition((position) => {
                location.value = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
                accuracy.value = position.coords.accuracy
                locationCollected.value = true
            })
        } else {
            locationError.value = true
        }
    }

    const googleMapsEmbedUrl = computed(() => {
        if ( !location.value) {
            return false
        }
    
        return `https://www.google.com/maps/embed/v1/place?key=${config.public.GOOGLE_PLACES_API_KEY}&q=${location.value.lat},${location.value.lng}&center=${location.value.lat},${location.value.lng}&zoom=15`
    })

    function setLocation(city) {
        location.value = popularLocations[city]
        locationError.value = false
    }
    

    return {
        location,
        accuracy,
        locationCollected,
        locationError,
        popularLocations,
        getUserLocation,
        setLocation,
        googleMapsEmbedUrl
    }

}
