import {actionButton, passwordMask} from "./constants.js";
import {deleteUser, editUser, getAllRoles, getCurrentUser, getUser} from "./getSetObjects.js";
import {showAdminPanelTab, rolesFromOptionArray, renderBlackMenu} from "./adminPanel.js";

export const editUserModalDialog = async userId => {
    setDialogElements(userId, "Edit user", actionButton.EDIT);
    renderDialogFields(await getUser(userId), true);
}

export const delUserModalDialog = async userId => {
    setDialogElements(userId, "Delete user", actionButton.DELETE);
    renderDialogFields(await getUser(userId), false);
}

const setDialogElements = (userId, captionText, button) => {
    const caption = document.getElementById("staticBLabel");
    caption.innerText = captionText;
    const actionBtn = document.getElementById("action-btn");
    switch (button) {
        case actionButton.EDIT: {
            actionBtn.textContent = "Edit";
            actionBtn.classList.add("btn-primary");
            actionBtn.classList.remove("btn-danger");
            const modalDialogButton = document.getElementById("action-btn");
            modalDialogButton.removeEventListener("click", () => deleteEditedUser());
            modalDialogButton.addEventListener("click", () => saveEditedUser());
            break;
        }
        case actionButton.DELETE: {
            actionBtn.textContent = "Delete";
            actionBtn.classList.remove("btn-primary");
            actionBtn.classList.add("btn-danger");
            const modalDialogButton = document.getElementById("action-btn");
            modalDialogButton.removeEventListener("click", () => saveEditedUser());
            modalDialogButton.addEventListener("click", () => deleteEditedUser());
            break;
        }
    }
}

const saveEditedUser = async () => {
    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const surname = document.getElementById("surname").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const roles = rolesFromOptionArray(document.getElementById("roles").options);
    const user = {id, username, password, name, surname, roles};
    await editUser(user);
    renderBlackMenu(await getCurrentUser());
    showAdminPanelTab();
}

const deleteEditedUser = async () => {
    const id = document.getElementById("id").value;
    await deleteUser(id);
    showAdminPanelTab();
}

const renderDialogFields = async ({id, name, roles, surname, username}, enabledInputFields) => {
    const idField = document.getElementById("id");
    const inName = document.getElementById("name");
    const inSurname = document.getElementById("surname");
    const inUsername = document.getElementById("username");
    const inPassword = document.getElementById("password");
    const labelPassword = document.getElementById("labelPassword");
    const groupRole = document.getElementById("roles");
    groupRole.innerHTML = "";
    let allRoles = await getAllRoles();
    let listRoles = [];
    if (enabledInputFields) {
        allRoles.forEach(role => {
            roles.forEach(userRole => {role.checked = (role.checked || role.id === userRole.id)});
        });
        inPassword.classList.remove("visually-hidden");
        labelPassword.classList.remove("visually-hidden");
        listRoles = allRoles;
    } else {
        inPassword.classList.add("visually-hidden");
        labelPassword.classList.add("visually-hidden");
        allRoles.forEach(role => roles.forEach((userRole, iter) => {
            if (role.id === userRole.id) {
                listRoles[iter] = role;
                listRoles[iter].checked = false;
            }
        }));
    }
    listRoles.sort(r => r.checked ? -1 : 1).forEach(role => {
        let option = document.createElement("option");
        option.append(document.createTextNode(role.name));
        option.value = role.id;
        option.selected = role.checked;
        option.disabled = !enabledInputFields;
        groupRole.append(option);
    });
    idField.setAttribute("value", id);
    inName.setAttribute("value", name);
    inName.disabled = !enabledInputFields;
    inSurname.setAttribute("value", surname);
    inSurname.disabled = !enabledInputFields;
    inUsername.setAttribute("value", username);
    inUsername.disabled = !enabledInputFields;
    inPassword.setAttribute("value", passwordMask);
}