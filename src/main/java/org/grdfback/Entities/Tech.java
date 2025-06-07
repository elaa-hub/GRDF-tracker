package org.grdfback.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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

    private String firstName;
    private String lastName;
    private String picture;
    private String notes;
    private String address;
    private String descriptionTech;
    @OneToMany(mappedBy = "tech")
    @JsonManagedReference
    private List<Task> tasks;

    @Column(name = "is_busy")
    private Boolean isBusy = false;

}
