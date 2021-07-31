package web.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NonNull;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import javax.persistence.*;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "users")
public @Data class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 50, nullable = false, unique = true)
    @NonNull
    private String username;
    @Column(nullable = false)
    @JsonIgnore
    @NonNull
    private String password;
    @Column(length = 50, nullable = false)
    private String name;
    @Column(length = 50, nullable = false)
    private String surname;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;

    public User() {
    }

    public User(String username) {
        this.username = username;
    }

    public User(String username, String password, String name, String surname, Set<Role> roles) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.roles = roles;
    }

//    public void setRoles(Set<Role> roles) {
//        this.roles = roles;
//    }
//
//    public Set<Role> getRoles() {
//        return roles;
//    }
//
//    public void setPassword(String password) {
//        this.password = password;
//    }
//
//    public String getPassword() {
//        return password;
//    }
//
//    public void setUsername(String username) {
//        this.username = username.trim().toLowerCase();
//    }
//
//    public String getUsername() {
//        return username;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public Long getId() {
//        return id;
//    }
//
//    public void setName(String name) {
//        this.name = name;
//    }
//
//    public String getName() {
//        return name;
//    }
//
//    public void setSurname(String surname) {
//        this.surname = surname;
//    }
//
//    public String getSurname() {
//        return surname;
//    }
//
//    @Override
//    public String toString() {
//        return "User{" +
//                "id=" + id +
//                ", username='" + username + '\'' +
//                ", password='" + password + '\'' +
//                ", name='" + name + '\'' +
//                ", surname='" + surname + '\'' +
//                ", roles=" + roles +
//                '}';
//    }
}
