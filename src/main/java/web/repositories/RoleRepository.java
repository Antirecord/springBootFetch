package web.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import web.entities.Role;

public interface RoleRepository extends JpaRepository<Role, Long>{
}
