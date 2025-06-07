package org.grdfback.Controllers;

import org.grdfback.Entities.*;
import org.grdfback.Repositories.ClientRepository;
import org.grdfback.Repositories.NotificationRepository;
import org.grdfback.Repositories.TechRepository;
import org.grdfback.Repositories.UserRepository;
import org.grdfback.Services.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.grdfback.DTOs.NotificationRequest;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200") // Allow frontend
@RestController
@RequestMapping("/api/clients")


public class ClientController {

    @Autowired
    private ClientService clientService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired private TechRepository techRepository; // ✅ Ajouté


    @GetMapping("/client")
    public ResponseEntity<Long> getClientIdByEmail(@RequestParam String idByEmail) {
        Optional<User> user = userRepository.findByEmail(idByEmail);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get().getId());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/client/address")
    public ResponseEntity<String> getClientAddress(@RequestParam String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            Client client = clientRepository.findById(user.get().getId()).orElse(null);
            return ResponseEntity.ok(client.getHouseAddress());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    @PostMapping("/notifications")
    public ResponseEntity<Void> signalerDefaillance(@RequestBody NotificationRequest request) {
        Notification notif = new Notification();

        Client client = clientRepository.findById(request.getClientId()).orElse(null);
        notif.setClient(client);
        notif.setTaskNeeded(request.isTaskNeeded());

        if (request.isTaskNeeded()) {
            Optional<Tech> optionalTech = techRepository.findTopByIsBusyFalse();
            if (optionalTech.isPresent()) {
                Tech technician = optionalTech.get();
                technician.setIsBusy(true);
                techRepository.save(technician);
                notif.setTechnician(technician);
            } else {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
            }
        }

        notificationRepository.save(notif);
        return ResponseEntity.ok().build();
    }

}





