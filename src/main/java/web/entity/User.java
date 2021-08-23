package web.entity;

import lombok.Data;
import lombok.NonNull;
import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "users")
public @Data class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 50, nullable = false, unique = true)
    @NonNull
    private String email;
    @Column(nullable = false)
    @NonNull
    private String password;
    @Column(length = 50)
    private String firstName;
    @Column(length = 50)
    private String lastName;

    @Column(length = 3, nullable = false)
    private int age;
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;

    public User() {
    }

    public User(String email) {
        this.email = email;
    }

    public User(String email, String password, String firstName, String lastName, int age, Set<Role> roles) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.roles = roles;
    }

}
