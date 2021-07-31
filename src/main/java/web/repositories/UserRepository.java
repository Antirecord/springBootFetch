package web.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import web.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
