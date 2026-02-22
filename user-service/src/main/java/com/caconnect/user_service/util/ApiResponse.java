package com.caconnect.user_service.util;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * Generic API response wrapper used to standardize all backend responses.
 * <p>
 * This class provides a consistent structure for both successful and failed API calls,
 * including timestamp, HTTP status, success flag, message, and optional data payload.
 * </p>
 *
 * <p>Typical JSON structure:</p>
 * <pre>
 * {
 *   "timestamp": "2026-02-22T10:15:30",
 *   "status": 200,
 *   "success": true,
 *   "message": "User registered successfully",
 *   "data": { ... }
 * }
 * </pre>
 *
 * <p>Use {@link #success(Object, String, int)} for successful responses and
 * {@link #error(String, int)} for error responses.</p>
 *
 * @param <T> Type of the response payload
 * @author Albin
 */
@Builder
@Getter
public final class ApiResponse<T> {

    /**
     * Time when the response was generated.
     */
    private final LocalDateTime timestamp;

    /**
     * HTTP status code of the response.
     */
    private final int status;

    /**
     * Indicates whether the request was successful.
     */
    private final boolean success;

    /**
     * Human-readable message describing the result.
     */
    private final String message;

    /**
     * Response payload data (can be null for errors).
     */
    private final T data;

    /**
     * Creates a success response with payload.
     *
     * @param data    response data
     * @param message success message
     * @param status  HTTP status code
     * @param <T>     type of payload
     * @return ApiResponse containing success result
     */
    public static <T> ApiResponse<T> success(T data, String message, int status){
        return ApiResponse.<T>builder()
                .timestamp(LocalDateTime.now())
                .data(data)
                .success(true)
                .message(message)
                .status(status)
                .build();
    }

    /**
     * Creates an error response without payload.
     *
     * @param message error message
     * @param status  HTTP status code
     * @param <T>     type of payload
     * @return ApiResponse containing error result
     */
    public static <T> ApiResponse<T> error(String message, int status){
        return ApiResponse.<T>builder()
                .timestamp(LocalDateTime.now())
                .success(false)
                .status(status)
                .message(message)
                .build();
    }
}