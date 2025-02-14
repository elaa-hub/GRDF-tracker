package org.grdfback.Entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "client")
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long clientId; // Corrected field name

    private String firstName; // Corrected to match Java naming conventions
    private String lastName;
    private String picture; // Corrected to match Java naming conventions
    private String address;
    private String houseAddress;

    @OneToMany(mappedBy = "client")
    private List<Task> tasks; }