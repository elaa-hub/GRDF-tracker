package org.grdfback.Entities;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tech")
public class Tech {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long techID;

    private String firstName; // Changed from FirstName
    private String lastName;
    private String picture;
    private String notes;
    private String address;
    private String descriptionTech;
    @OneToMany(mappedBy = "tech")  // Ensure this matches the Task field
    private List<Task> tasks;
}
