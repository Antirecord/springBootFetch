import {actionButton, passwordMask} from "./constants.js";
import {getAllRoles, getUser} from "./getSetObjects.js";

export const editUser = async userId => {
    setDialogElements(userId, "Edit user", actionButton.EDIT);
    renderDialogFields(await getUser(userId), true);
}

export const delUser = async userId => {
    setDialogElements(userId, "Delete user", actionButton.DELETE);
    renderDialogFields(await getUser(userId), false);
}

const setDialogElements = (userId, captionText, actionButton) => {
    const caption = document.getElementById("staticBLabel");
    caption.innerText = captionText;

    const actionBtn = document.getElementsByName("action-btn")[0];
    const formAction = document.querySelector(".form-horizontal");
    switch (actionButton) {
        case actionButton.EDIT: {
            formAction.action = ""
            actionBtn.textContent = "Edit";
            actionBtn.classList.add("btn-primary");
            actionBtn.classList.remove("btn-danger");
            break;
        }
        case actionButton.DELETE: {
            formAction.action = "/deleteUser/" + userId;
            actionBtn.textContent = "Delete";
            actionBtn.classList.remove("btn-primary");
            actionBtn.classList.add("btn-danger");
            break;
        }
    }
}

const renderDialogFields = async ({id, name, roles, surname, username}, enabledInputFields) => {
    const inName = document.getElementById("name");
    const inSurname = document.getElementById("surname");
    const inUsername = document.getElementById("username");
    const inPassword = document.getElementById("password");
    const labelPassword = document.getElementById("labelPassword");
    const groupRole = document.getElementById("roleGroup");
    let allRoles = await getAllRoles();
    allRoles.forEach(role => {
        roles.forEach(userRole => role.checked = (role.id === userRole.id));
        let checkboxRole = document.getElementById("roleCheck" + role.id);
        if (checkboxRole) {
            checkboxRole.parentElement.removeChild(
                document.getElementById("roleCheckLabel" + role.id)
            );
            checkboxRole.parentElement.removeChild(checkboxRole);
        }
    });
    let listRoles = [];
    if (enabledInputFields) {
        inPassword.classList.remove("visually-hidden");
        labelPassword.classList.remove("visually-hidden");
        listRoles = allRoles;
    } else {
        inPassword.classList.add("visually-hidden");
        labelPassword.classList.add("visually-hidden");
        allRoles.forEach(roleAll => roles.forEach((roleUser, iter) => {
            if (roleAll.id === roleUser.id) {
                listRoles[iter] = roleAll;
                listRoles[iter].checked = false;
            }
        }));
    }
    listRoles.sort(r => r.checked ? -1 : 1).forEach(role => {
        let checkboxRole = document.getElementById("roleCheck" + role.id);
        let labelRole;
        if (!checkboxRole) {
            checkboxRole = document.createElement("input");
            checkboxRole.setAttribute("type", "checkbox");
            checkboxRole.classList.add("btn-check");
            checkboxRole.setAttribute("id", "roleCheck" + role.id);
            labelRole = document.createElement("label");
            labelRole.setAttribute("for", "roleCheck" + role.id);
            labelRole.setAttribute("id", "roleCheckLabel" + role.id);
        } else {
            labelRole = document.getElementById("roleCheckLabel" + role.id);
        }
        if (enabledInputFields) {
            labelRole.classList.add("btn-outline-primary");
            labelRole.classList.remove("btn-outline-secondary");
            labelRole.classList.remove("disabled");
        } else {
            labelRole.classList.add("btn-outline-secondary");
            labelRole.classList.add("disabled");
            labelRole.classList.remove("btn-outline-primary");
        }
        checkboxRole.disabled = !enabledInputFields;
        checkboxRole.checked = role.checked;
        labelRole.innerText = role.name;
        //.innerHTML, .textContent
        groupRole.append(checkboxRole, labelRole);
    });
    inName.setAttribute("value", name);
    inName.disabled = !enabledInputFields;
    inSurname.setAttribute("value", surname);
    inSurname.disabled = !enabledInputFields;
    inUsername.setAttribute("value", username);
    inUsername.disabled = !enabledInputFields;
    inPassword.setAttribute("value", passwordMask);
}