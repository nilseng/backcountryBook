import { debounce } from "lodash"
import { useEffect } from "react"

export const useScroll = (action: Function, windowHeight: number) => {

    useEffect(() => {
        window.addEventListener('scroll', () => onScrollAction(action, windowHeight))
        return window.removeEventListener('scroll', () => onScrollAction(action, windowHeight))
    }, [action, windowHeight])
}

const onScrollAction = debounce((action: Function, windowHeight: number) => {
    if (windowHeight + document.documentElement.scrollTop === document?.scrollingElement?.scrollHeight) {
        action()
    }
}, 250)