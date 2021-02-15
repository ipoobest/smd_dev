// export default async function({ store, redirect }) {
//   if (!store.state.auth.auth) {
//     return redirect('/login')
//   } else {
//     const user = await store.$axios.$get(`${process.env.parseUrl}/users/me`)
//     
//   }
// }

export default async function ({ store, redirect }) {
  if (!store.state.auth.auth) {
    // 
    return redirect('/login')
  } else if (store.state.auth.auth.type == "ครู") {
    // 
    return redirect(`/teachers/${store.state.auth.auth.objectId}`);
    // const user = await store.$axios.$get(`${process.env.parseUrl}/users/me`)
    // 
  } else if(store.state.auth.auth.type == "หัวหน้ากลุ่มสาระ") {
    return redirect(`/staff/${store.state.auth.auth.objectId}`);
  }
}

