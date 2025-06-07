package org.grdfback.DTOs;

import lombok.Data;


@Data
public class NotificationRequest {
    private Long clientId;
    private boolean taskNeeded;
    private String description;

}