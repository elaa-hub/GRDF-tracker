package org.grdfback.Controllers;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/generate")
public class PasswordGeneratorController {

    @GetMapping("/hash")
    public String generateHash(@RequestParam String password) {
        return new BCryptPasswordEncoder().encode(password);
    }
}
