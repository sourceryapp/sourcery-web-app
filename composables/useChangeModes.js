export default function useChangeModes() {
    const { setResearcher, setSourcerer } = useToggleTheme()
    const currentMode = useState('mode', () => 'researcher')

    function setMode(mode) {
        console.log('setting!', mode, currentMode.value)
        currentMode.value = mode

        if (currentMode.value === 'researcher') {
            console.log('setting researcher')
            setResearcher()
        } else if (currentMode.value === 'sourcerer') {
            console.log('setting sourcerer')
            setSourcerer()
        }
    }

    return {
        setMode,
        currentMode
    }
}