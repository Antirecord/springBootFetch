package web.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import web.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long>{
}
