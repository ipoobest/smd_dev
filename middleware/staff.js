export default async function({ store, redirect }) {
  if (!store.state.auth.auth) {
    // 
    // 
    return redirect("/login");
  } else if (store.state.auth.auth.type != "หัวหน้ากลุ่มสาระ") {
    // 
    var userType = store.state.auth.auth.type;
    var user;
    if (userType == "ครู") {
      user = "teachers";
    } else if (userType == "หัวหน้าประเมิน") {
      user = "assessment";
    } else if (userType == "นักเรียน") {
      user = "students";
    }
    return redirect(`/${user}/${store.state.auth.auth.objectId}`);
  }
}
