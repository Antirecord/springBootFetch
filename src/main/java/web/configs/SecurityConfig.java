package web.configs;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;
import web.repositories.JwtCsrfFilter;
import web.repositories.JwtTokenRepository;
import web.services.UserServiceImpl;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final UserServiceImpl userService;
    private final JwtTokenRepository jwtTokenRepository;
    private final HandlerExceptionResolver resolver;

    public SecurityConfig(UserServiceImpl userService, JwtTokenRepository jwtTokenRepository,
                          @Qualifier("handlerExceptionResolver") HandlerExceptionResolver resolver) {
        this.userService = userService;
        this.jwtTokenRepository = jwtTokenRepository;
        this.resolver = resolver;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.sessionManagement()
                // отключаем генерацию сессии
                .sessionCreationPolicy(SessionCreationPolicy.NEVER)
                .and()
                // указываем созданный нами фильтр JwtCsrfFilter в расположение стандартного фильтра,
                // при этом игнорируем обработку стандартного
                .addFilterAt(new JwtCsrfFilter(jwtTokenRepository, resolver), CsrfFilter.class)
                .csrf().ignoringAntMatchers("/api/**")
                .and()
                .authorizeRequests()
                // для запроса /auth/login выполняем авторизацию силами security.
                // Что бы не было двойной валидации (по токену и базовой),
                // запрос был добавлен в исключение к классу JwtCsrfFilter
                .antMatchers("/api/login").authenticated()
                .and()
                // ошибки базовой авторизации отправляем в обработку GlobalExceptionHandler
                .httpBasic()
                .authenticationEntryPoint(
                        (request, response, e) -> resolver.resolveException(request, response, null, e));
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        authenticationProvider.setUserDetailsService(userService);

        return authenticationProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
