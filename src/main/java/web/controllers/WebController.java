package web.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import web.services.UserService;

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
