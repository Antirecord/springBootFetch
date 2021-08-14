package web.configs;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.servlet.HandlerExceptionResolver;
import web.configs.handler.LoginSuccessHandler;
import web.services.UserServiceImpl;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final UserServiceImpl userService;
    private final HandlerExceptionResolver resolver;

    public SecurityConfig(UserServiceImpl userService,
                          @Qualifier("handlerExceptionResolver") HandlerExceptionResolver resolver) {
        this.userService = userService;
        this.resolver = resolver;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService);
    }



    @Override
    protected void configure(HttpSecurity http) throws Exception {
//        http.sessionManagement()
                // отключаем генерацию сессии
//                .sessionCreationPolicy(SessionCreationPolicy.NEVER)
//                .and()
                // указываем созданный нами фильтр JwtCsrfFilter в расположение стандартного фильтра,
                // при этом игнорируем обработку стандартного
//                .addFilterAt(new JwtCsrfFilter(jwtTokenRepository, resolver), CsrfFilter.class)
//                .csrf().ignoringAntMatchers("/api/**");
//                .and()
//                .authorizeRequests()
//                // для запроса /auth/login выполняем авторизацию силами security.
//                // Что бы не было двойной валидации (по токену и базовой),
//                // запрос был добавлен в исключение к классу JwtCsrfFilter
//                .antMatchers("/api/login").authenticated()
                // ошибки базовой авторизации отправляем в обработку GlobalExceptionHandler
//                .httpBasic()
//                .authenticationEntryPoint((request, response, e)
//                        -> resolver.resolveException(request, response, null, e));
        http.formLogin()
                // указываем страницу с формой логина
                .loginPage("/login")
                // Указываем параметры логина и пароля с формы логина
                .usernameParameter("j_username")
                .passwordParameter("j_password")
                //указываем логику обработки при логине
                .successHandler(new LoginSuccessHandler())
                // указываем action с формы логина
                .loginProcessingUrl("/login")
                // даем доступ к форме логина всем
                .permitAll();

        http.logout()
                // разрешаем делать логаут всем
                .permitAll()
                // указываем URL логаута
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                // указываем URL при удачном логауте
                .logoutSuccessUrl("/login?logout")
                //выключаем кроссдоменную секьюрность (на этапе обучения неважна)
                .and().csrf().disable();

        http.authorizeRequests()
                //страницы аутентификаци доступна всем
                .antMatchers("/login").anonymous()
                // защищенные URL
                .antMatchers("/api/admin/**").hasRole("ADMIN")
                .antMatchers("/api/user/**").hasRole("USER")
                .antMatchers("/api/**").hasAnyRole("USER", "ADMIN")
                .anyRequest().authenticated();

    }

    @Override
    public void configure(final WebSecurity web) throws Exception {
        web.ignoring()
                .antMatchers("/js/**", "/css/**");
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
