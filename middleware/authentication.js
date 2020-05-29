export default async function({ store, redirect }) {
  if (!store.state.auth.auth) {
    return redirect('/login')
  } else {
    const user = await store.$axios.$get(`${process.env.parseUrl}/users/me`)
    console.log('user/me', user)
  }
}
