// export default async function({ store, redirect }) {
//   if (!store.state.auth.auth) {
//     return redirect('/login')
//   } else {
//     const user = await store.$axios.$get(`${process.env.parseUrl}/users/me`)
//     console.log('user/me', user)
//   }
// }

export default async function ({ store, redirect }) {
  if (!store.state.auth.auth) {
    console.log('auth xxx', store.state.auth.auth)
    return redirect('/login')
  } else if (store.state.auth.auth.type == "ครู") {
    console.log('auth ddd', store.state.auth.auth.type)
    return redirect(`/teachers/${store.state.auth.auth.objectId}`);
    // const user = await store.$axios.$get(`${process.env.parseUrl}/users/me`)
    // console.log('user/me', user)
  }
}

