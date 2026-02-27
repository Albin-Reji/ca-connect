package com.caconnect.location_service.repository;

import com.caconnect.location_service.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, String> {

    Location getByUserId(String userId);

    @Query(value = """
            SELECT * FROM location
            ORDER BY earth_distance(
                ll_to_earth(latitude, longitude),
                ll_to_earth(:lat, :lon)
            )
            LIMIT :limit
            """, nativeQuery = true)
    List<Location> getNearestLocation(
            @Param("lat") Double lat,@Param("lon") Double lon, @Param("limit") Integer limit
    );

    Optional<Location> findByLocationId(String locationId);

    @Query(value = """
        SELECT *
        FROM location
        WHERE user_id IN (:userIds)
        ORDER BY earth_distance(
            ll_to_earth(:lat, :lon),
            ll_to_earth(latitude, longitude)
        )
        LIMIT :limit
        """,
            nativeQuery = true)
    List<Location> findNearestByUserIds(
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("limit") Integer limit,
            @Param("userIds") List<String> userIds
    );
}
