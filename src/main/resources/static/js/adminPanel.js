import {getAllRoles, getAllUsers, getCurrentUser, roleName} from "./getSetObjects.js";
import {delUser, editUser} from "./modalDialog.js";

const renderAdminPanel = async () => {
    const allUsers = await getAllUsers();
    const tableUsersList = document.getElementById("usersList");
    const tbody = tableUsersList.getElementsByTagName("TBODY")[0];
    tbody.innerHTML = "";
    addHeaders(tbody, false);
    allUsers.forEach(user => addRow(user, tbody, false));
    const newUserMenu = document.getElementById("newUserMenu");
    newUserMenu.addEventListener("click", () => newUserTab());
    const usersTableMenu = document.getElementById("usersTableMenu");
    usersTableMenu.addEventListener("click", () => adminPanelTab());
    const userPanel = document.getElementById("userPanel");
    userPanel.addEventListener("click", () => showUserPanel());
    const adminPanel = document.getElementById("adminPanel");
    adminPanel.addEventListener("click", () => adminPanelTab());
}

const renderUserPanel = async () => {
    let user = await getCurrentUser();
    const tableUsersList = document.getElementById("usersTable");
    const tbody = tableUsersList.getElementsByTagName("TBODY")[0];
    tbody.innerHTML = "";
    addHeaders(tbody, true);
    addRow(user, tbody, true);

}

const newUserTab = async () => {
    const addNewUserButton = document.getElementById("addNewUserButton");
    addNewUserButton.addEventListener("click", () => addNewUser());
    const newRoles = document.getElementById("newRoles");
    newRoles.innerHTML = "";
    (await getAllRoles()).forEach(role => {
        let option = document.createElement("option");
        option.append(document.createTextNode(role.name));
        newRoles.append(option);
    });
    const adminPanelTab = document.getElementById("adminPanelTab");
    adminPanelTab.classList.add("visually-hidden");
    const currentUserView = document.getElementById("currentUserView");
    currentUserView.classList.add("visually-hidden");
    const newUserTab = document.getElementById("newUserTab");
    newUserTab.classList.remove("visually-hidden");
}

export const adminPanelTab = () => {
    const newUserTab = document.getElementById("newUserTab");
    newUserTab.classList.add("visually-hidden");
    const currentUserView = document.getElementById("currentUserView");
    currentUserView.classList.add("visually-hidden");
    renderAdminPanel();
    const adminPanelTab = document.getElementById("adminPanelTab");
    adminPanelTab.classList.remove("visually-hidden");
}

const addNewUser = () => {
    const newName = document.getElementById("newName");
    const newSurname = document.getElementById("newSurname");
    const newUsername = document.getElementById("newUsername");
    const newPassword = document.getElementById("newPassword");


}

const showUserPanel = () => {
    const newUserTab = document.getElementById("newUserTab");
    newUserTab.classList.add("visually-hidden");
    const adminPanelTab = document.getElementById("adminPanelTab");
    adminPanelTab.classList.add("visually-hidden");
    renderUserPanel();
    const currentUserView = document.getElementById("currentUserView");
    currentUserView.classList.remove("visually-hidden");
}

const addRow = (user, tbody, isWithoutOperationsColumn) => {
    const row = document.createElement("tr");
    const td = [];
    let end = isWithoutOperationsColumn ? 5 : 6;
    for (let i = 0; i < end; i++) {
        td[i] = document.createElement("td");
    }
    td[0].append(document.createTextNode(user.id));
    td[1].append(document.createTextNode(user.name));
    td[2].append(document.createTextNode(user.surname));
    td[3].append(document.createTextNode(user.username));
    td[4].append(document.createTextNode(splitRoles(user.roles)));
    if (!isWithoutOperationsColumn) {
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
        td[5].setAttribute("style", "width: 155px;");
    }
    row.append(...td);
    tbody.append(row);
}

const addHeaders = (tbody, isWithoutOperationsColumn) => {
    const headers = document.createElement("tr");
    const th = [];
    let end = isWithoutOperationsColumn ? 5 : 6;
    for (let i = 0; i < end; i++) {
        th[i] = document.createElement("th");
    }
    th[0].append(document.createTextNode("ID"));
    th[1].append(document.createTextNode("Name"));
    th[2].append(document.createTextNode("Lastname"));
    th[3].append(document.createTextNode("Username"));
    th[4].append(document.createTextNode("Roles"));
    if (!isWithoutOperationsColumn) {
        th[5].append(document.createTextNode("Operations"));
        th[5].classList.add("text-center");
    }
    headers.append(...th);
    tbody.append(headers);
}

const splitRoles = (roles) => {
    let string = "";
    roles.forEach(r => string += roleName(r.name) + ", ");
    return string.substr(0, string.length - 2);
}
