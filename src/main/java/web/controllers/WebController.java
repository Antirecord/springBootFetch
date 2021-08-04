package web.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import web.entities.Role;
import web.entities.User;
import web.services.UserService;

import java.util.List;

@Controller
@RequestMapping("/")
public class WebController {

    private final UserService userService;

    public WebController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/")
    public String startPage() {
        return "/index";
    }

    @GetMapping(value = "login")
    public String loginPage() {
        return "/login";
    }

}
