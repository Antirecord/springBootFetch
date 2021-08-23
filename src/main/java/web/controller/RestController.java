package web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import web.entity.Role;
import web.entity.User;
import web.service.UserService;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
@org.springframework.web.bind.annotation.RestController
@RequestMapping("/api")
public class RestController {
    private final UserService userService;
    private final PasswordEncoder encoder;

    public RestController(UserService userService, PasswordEncoder encoder) {
        this.userService = userService;
        this.encoder = encoder;
        if (userService.getAllUsers().size() == 0) {
            addDefaultUsersAndRoles();
        }
    }

    @GetMapping(value = "/admin/getAllUsers", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<User> jsonAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping(value = "/admin/getUser/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public User jsonUserById(@PathVariable(name = "id") Long id) {
        return userService.getUser(id);
    }

    @GetMapping(value = "/admin/getRole/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Role jsonRoleById(@PathVariable(name = "id") Long id) {
        return userService.getRoleById(id);
    }

    @GetMapping(value = "/admin/getAllRoles", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Role> jsonRoleById() {
        return userService.getAllRoles();
    }

    @PostMapping("/admin/addNewUser")
    public ResponseEntity<?> addUser(@RequestBody User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        userService.saveUser(user);
        User addedUser = userService.getUser(user.getId());
        return ResponseEntity.ok(addedUser);
    }

    @PutMapping("/admin/editUser")
    public ResponseEntity<?> editUser(@RequestBody User user) {
        if (user.getPassword().equals("_`@$secret$@`_")) {
            user.setPassword(userService.getUser(user.getId()).getPassword());
        } else {
            user.setPassword(encoder.encode(user.getPassword()));
        }
        userService.saveUser(user);
        User editUser = userService.getUser(user.getId());
        return ResponseEntity.ok(editUser);
    }

    @DeleteMapping("/admin/deleteUser/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable long id) {

        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(path = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody User getAuthUser() {
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

    private void addDefaultUsersAndRoles() {
        Set<Role> roles = new HashSet<>();
        roles.add(new Role("ROLE_ADMIN"));
        User user = new User("admin@mail.ru", encoder.encode("admin"),
                "Administrator", "DefaultAdminAccount", 22, roles);
        userService.saveUser(user);
        roles.clear();
        roles.add(new Role("ROLE_USER"));
        user = new User("user@mail.ru", encoder.encode("user"),
                "User", "DefaultUserAccount", 22, roles);
        userService.saveUser(user);
        userService.saveRole(new Role("ROLE_GUEST"));
    }
}
