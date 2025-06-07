package org.grdfback.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;


    private boolean taskNeeded;

    @ManyToOne
    @JoinColumn(name = "tech_id", referencedColumnName = "techId")
    private Tech technician;
    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Tech getTechnician() {
        return technician;
    }

    public void setTechnician(Tech technician) {
        this.technician = technician;
    }

    public Boolean getTaskNeeded() {
        return taskNeeded;
    }

    public void setTaskNeeded(Boolean taskNeeded) {
        this.taskNeeded = taskNeeded;
}}
