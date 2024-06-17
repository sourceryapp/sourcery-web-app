export function useHtmlFilters() {
    function textToAnchors(text) {
        return text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>')
    }

    return {
        textToAnchors
    }
}