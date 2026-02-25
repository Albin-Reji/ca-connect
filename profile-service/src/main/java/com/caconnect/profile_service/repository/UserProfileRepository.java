package com.caconnect.profile_service.repository;

import com.caconnect.profile_service.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, String> {

    UserProfile getByUserId(String userId);

    @Query(value = """
    SELECT up.*
    FROM user_profile up
    JOIN user_locations ul 
        ON up.location_id = ul.location_id
    WHERE up.exam_stage = :examStage
    ORDER BY (
        6371 * acos(
            cos(radians(:currentLat)) 
            * cos(radians(ul.latitude))
            * cos(radians(ul.longitude) - radians(:currentLon))
            + sin(radians(:currentLat)) 
            * sin(radians(ul.latitude))
        )
    ) ASC
    LIMIT :limit
    """,
            nativeQuery = true)
    List<UserProfile> findByExamStageWithLimit(
            @Param("examStage") String examStage,
            @Param("currentLat") double currentLat,
            @Param("currentLon") double currentLon,
            @Param("limit") Integer limit);
}
