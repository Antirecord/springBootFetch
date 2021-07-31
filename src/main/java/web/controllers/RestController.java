package web.controllers;

import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import web.entities.Role;
import web.entities.User;
import web.services.UserService;

import java.util.List;
import java.util.Objects;

@org.springframework.web.bind.annotation.RestController
@RequestMapping("/api")
public class RestController {
    private final UserService userService;

    public RestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(value = "getAllUsers", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<User> jsonAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping(value = "getUser/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public User jsonUserById(@PathVariable(name = "id") Long id) {
        return userService.getUser(id);
    }

    @GetMapping(value = "getRole/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Role jsonRoleById(@PathVariable(name = "id") Long id) {
        return userService.getRoleById(id);
    }

    @GetMapping(value = "getAllRoles", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Role> jsonRoleById() {
        return userService.getAllRoles();
    }

    @PostMapping("addUser")
    public void addUser(User user) {

    }

    @PutMapping("editUser")
    public void editUser(User user) {

    }

    @DeleteMapping("deleteUser")
    public void deleteUser(User user) {

    }

    @PostMapping(path = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    User getAuthUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            Object principal = auth.getPrincipal();
            if (principal instanceof org.springframework.security.core.userdetails.User) {
                String username = ((org.springframework.security.core.userdetails.User) principal).getUsername();
                return userService.getUser(username);
            }
        }
        return null;
    }
}
