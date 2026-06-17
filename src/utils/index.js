export const setHeaderTitle =(userType)=>{
 if(userType == "Fleet"){
    return "Fleet Management System"
 }else if (userType == "Asset"){
    return "Asset Management System"
 }else if (userType == "Accommodation"){
    return "Accommodation Management System"
 }else if (userType == "Store"){
    return "Store Management System"
 }else{
    return "Please wait ..."
 }
}

export const setSideBarTitle =(role)=>{
 if(role == "admin"){
    return "Administrator"
 }else if (role == "driver"){
    return "NCS Driver"
 }else if (role == "manager"){
    return "Asset Manager"
 }
 else if (role == "allocator"){
    return "Fleet Manager"
 }else if (role == "store"){
    return "Store Manager"
 }else if (role == "transport"){
    return "OC Transport & Logistic"
 }else if (role == "mechanic"){
    return "OC Mechanical"
 }else if (role == "user"){
    return "User Management"
 }else if (role == "view"){
    return "View Access"
 }else if (role == "asset_view"){
    return "View Access"
 }else if (role == "asset_zone"){
    return "Zonal Access"
 }
 else if (role == "zone"){
    return "Zonal Access"
 }else if (role == "chief_driver_com"){
    return "Chief Driver"
 }else if (role == "chief_driver"){
    return "Chief Driver HQ"
 }else{
    return role
 }
}


