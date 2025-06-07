package org.grdfback.Services;

import org.grdfback.DTOs.LoginRequest;
import org.grdfback.DTOs.LoginResponse;
import org.grdfback.Entities.User;
import org.grdfback.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtService jwtService;

    public LoginResponse authenticate(LoginRequest request) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword()
                )
        );
        System.out.println("✅ Authentifié : " + authentication.isAuthenticated());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));

        // ✅ Ajouter les informations supplémentaires dans le JWT
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("id", user.getId());
        extraClaims.put("role", user.getRole().name());

        // ✅ Générer le token avec les extraClaims
        String token = jwtService.generateToken(extraClaims, new UserDetailsImpl(user));

        return new LoginResponse(token, user.getRole().name());
    }

}
