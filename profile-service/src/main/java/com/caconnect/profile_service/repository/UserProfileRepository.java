package com.caconnect.profile_service.repository;

import com.caconnect.profile_service.model.ExamStage;
import com.caconnect.profile_service.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, String> {



    List<UserProfile> findAllByExamStage(ExamStage examStage);

    UserProfile findByKeyCloakId(String keyCloakId);

    Boolean existsByKeyCloakId(String keyCloakId);
}
