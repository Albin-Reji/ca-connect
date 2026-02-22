package com.caconnect.user_service.util;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * Utility class for building standardized {@link ResponseEntity} objects
 * containing {@link ApiResponse} bodies.
 *
 * <p>This class centralizes API response creation to ensure consistent
 * HTTP responses across all controllers in the application.</p>
 *
 * <p>Supports common response types:</p>
 * <ul>
 *     <li>200 OK – successful request</li>
 *     <li>201 Created – resource created</li>
 *     <li>500 Internal Server Error – failure response</li>
 * </ul>
 *
 * <p>All methods are static and the constructor is private to prevent instantiation.</p>
 *
 * @author Albin
 */
public class ApiResponses {

    /**
     * Private constructor to prevent instantiation of utility class.
     */
    private ApiResponses() {
    }

    /**
     * Builds a 200 OK response with success payload.
     *
     * @param data    response data
     * @param message success message
     * @param <T>     payload type
     * @return ResponseEntity containing ApiResponse with HTTP 200 status
     */
    public static <T> ResponseEntity<ApiResponse<T>> ok(T data, String message){
        return ResponseEntity.ok(
                ApiResponse.success(data, message, HttpStatus.OK.value())
        );
    }

    /**
     * Builds a response indicating a resource was created.
     *
     * <p>NOTE: Currently returns HTTP 200.
     * For REST correctness, consider using {@code ResponseEntity.status(HttpStatus.CREATED)}.</p>
     *
     * @param data    created resource data
     * @param message success message
     * @param <T>     payload type
     * @return ResponseEntity containing ApiResponse for created resource
     */
    public static <T> ResponseEntity<ApiResponse<T>> created(T data, String message){
        return ResponseEntity.ok(
                ApiResponse.success(data, message, HttpStatus.OK.value())
        );
    }

    /**
     * Builds a generic error response.
     *
     * <p>NOTE: Currently returns HTTP 200 with error body.
     * For proper REST semantics, consider returning
     * {@code ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)}.</p>
     *
     * @param message error message
     * @param <T>     payload type
     * @return ResponseEntity containing ApiResponse with error details
     */
    public static <T> ResponseEntity<ApiResponse<T>> error(String message){
        return ResponseEntity.ok(
                ApiResponse.error(
                        message,
                        HttpStatus.INTERNAL_SERVER_ERROR.value()
                )
        );
    }
}