export const getUser = async (sub: string) => {
    const user = await fetch(`/api/user/${sub}`)
    return user.json()
}