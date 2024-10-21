export const hasToken = () => {
    let token = localStorage.getItem("token")
    console.log("FInalized token: " + token)
    return token
}

let ROLE = ""

export const getRoleFromToken = () => {
    return ROLE
}

export const setRoleFromToken = (role) => {
    ROLE = role
}