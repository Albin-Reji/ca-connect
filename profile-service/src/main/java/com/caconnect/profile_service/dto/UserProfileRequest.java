package com.caconnect.profile_service.dto;

import com.caconnect.profile_service.model.Address;
import com.caconnect.profile_service.model.ExamStage;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileRequest {

    private String userId;
    private String fullName;
    private Integer age;
    private ExamStage examStage;
    private Address address;
    private String email;
    private String phoneNumber;

}
