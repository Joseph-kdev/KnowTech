export const reducer = (state, action) => {
    switch (action.type) {
        case "email-entered":
            return { ...state, email: action.payload }
        case "password-entered":
            return { ...state, password: action.payload }
        case "has-account":
            return { ...state, hasAccount: !state.hasAccount }
        case "show-all":
            return { ...state, showAll: !state.showAll }
        case "open-modal":
            return { ...state, open: !state.open }
        case "summary":
            return { ...state, blogSummary: action.payload }

        default:
            throw new Error()
    }
}