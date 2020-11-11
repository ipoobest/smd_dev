export default async function({ store, redirect }) {
  if (!store.state.auth.auth) {
    console.log("auth ", store.state.auth.auth);
    console.log("auth ddd", store.state.auth.auth.type);
    return redirect("/login");
  } else if (store.state.auth.auth.type != "ผู้ดูแลระบบ") {
    console.log("auth ddd", store.state.auth.auth.type);
    var userType = store.state.auth.auth.type;
    var user;
    if(userType == "ครู") {
      user = "teachers"
    } else if (userType == "หัวหน้ากลุ่มสาระ") {
      user = "staff";
    } else if(userType == "หัวหน้าประเมิน") {
      user = "assessment"; 
    } else if (userType == "นักเรียน")
      user = "students"
    return redirect(
      `/${user}/${store.state.auth.auth.objectId}`
    );
  } 
}
