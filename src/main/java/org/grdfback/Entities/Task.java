package org.grdfback.Entities;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jdk.jfr.Description;
import lombok.*;

import java.time.LocalDate;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "task")

public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long taskId;
    @Getter
    @Setter

    private String description;
    private LocalDate taskDate;
    private Integer rating;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technician_id") // Matches "tech" field in Task
    @JsonIgnore
    private Tech tech;

    @ManyToOne
    @JoinColumn(name = "client_id") // Matches "client" field in Task
    @JsonIgnore
    private Client client;
    public void setTech(Tech tech) {
        this.tech = tech;
    }

    // Add this setter method for the client field
    public void setClient(Client client) {
        this.client = client;
    }

    public void setTaskDate(LocalDate taskDate) {
        this.taskDate = taskDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getTaskId() {
        return taskId;
    }

    public LocalDate getTaskDate() {
        return taskDate;
    }

    public Integer getRating() {
        return rating;
    }



}