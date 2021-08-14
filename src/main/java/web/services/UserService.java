package web.services;

import org.springframework.security.core.userdetails.UserDetailsService;
import web.entities.Role;
import web.entities.User;

import java.util.List;

public interface UserService extends UserDetailsService {
    List<User> getAllUsers();
    void saveUser(User user);
    User getUser(long id);
    User getUser(String email);
    void deleteUser(long id);
    void deleteUser(User user);
    List<Role> getAllRoles();
    void saveRole(Role role);
    Role getRoleById(long id);
}
