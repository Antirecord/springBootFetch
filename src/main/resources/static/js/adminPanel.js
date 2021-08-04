import {getAllUsers, getUser} from "./getSetObjects.js";
import {delUser, editUser} from "./modalDialog.js";

export const renderAdminPanel = async () => {
    const allUsers = await getAllUsers();
    const tableUsersList = document.getElementById("usersList");
    const tbody = tableUsersList.getElementsByTagName("TBODY")[0];
    tbody.innerHTML = "";
    addHeaders(tbody);
    allUsers.forEach(user => addRow(user, tbody));
}

const addRow = (user, tbody) => {
    const row = document.createElement("tr");
    const td = [];
    for (let i = 0; i < 6; i++) {
        td[i] = document.createElement("td");
    }
    td[0].append(document.createTextNode(user.id));
    td[1].append(document.createTextNode(user.name));
    td[2].append(document.createTextNode(user.surname));
    td[3].append(document.createTextNode(user.username));
    td[4].append(document.createTextNode(splitRoles(user.roles)));
    const buttonEdit = document.createElement("button");
    buttonEdit.setAttribute("data-bs-toggle", "modal");
    buttonEdit.setAttribute("data-bs-target", "#editUser");
    buttonEdit.addEventListener("click", () => editUser(user.id));
    buttonEdit.classList.add("btn", "btn-info");
    buttonEdit.append(document.createTextNode("Edit"));
    const buttonDel = document.createElement("button");
    buttonDel.setAttribute("data-bs-toggle", "modal");
    buttonDel.setAttribute("data-bs-target", "#editUser");
    buttonDel.addEventListener("click", () => delUser(user.id))
    buttonDel.classList.add("btn", "btn-danger");
    buttonDel.append(document.createTextNode("Delete"));
    td[5].append(buttonEdit, buttonDel);
    row.append(...td);
    tbody.append(row);
}

const addHeaders = (tbody) => {
    const headers = document.createElement("tr");
    const th = [];
    for (let i = 0; i < 6; i++) {
        th[i] = document.createElement("th");
    }
    th[0].append(document.createTextNode("ID"));
    th[1].append(document.createTextNode("Name"));
    th[2].append(document.createTextNode("Lastname"));
    th[3].append(document.createTextNode("Username"));
    th[4].append(document.createTextNode("Roles"));
    th[5].append(document.createTextNode("Operations"));
    th[5].classList.add("text-center");
    headers.append(...th);
    tbody.append(headers);
}

const splitRoles = (roles) => {
    let string = "";
    roles.forEach(r => string += r.name.substr(r.name.indexOf("_") + 1) + ", ");
    return string.substr(0, string.length-2);
}
