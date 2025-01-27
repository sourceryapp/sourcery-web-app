export default function useChangeModes() {
    
    const currentMode = useState('mode', () => {
        return 'researcher'
    })

    function setMode(mode) {
        console.log('setting!', mode, currentMode.value)
        currentMode.value = mode

        if (currentMode.value === 'researcher') {
            console.log('setting researcher')
            return navigateTo('/research')
        } else if (currentMode.value === 'sourcerer') {
            console.log('setting sourcerer')
            return navigateTo('/sourcerer/verify')
        }
        return true
    }

    const fulfilling = computed(() => {
        return ['sourcerer', 'organization'].includes(currentMode.value)
    })

    const researching = computed(() => {
        return ['researcher', 'organization'].includes(currentMode.value)
    })

    return {
        setMode,
        currentMode,
        fulfilling,
        researching
    }
}