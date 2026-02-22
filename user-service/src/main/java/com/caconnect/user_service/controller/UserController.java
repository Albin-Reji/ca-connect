package com.caconnect.user_service.controller;

import com.caconnect.user_service.dto.RegisterRequest;
import com.caconnect.user_service.dto.UserResponse;
import com.caconnect.user_service.model.User;
import com.caconnect.user_service.service.UserService;
import com.caconnect.user_service.util.ApiResponse;
import com.caconnect.user_service.util.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest request){
        return ApiResponses.ok(
                userService.register(request), "User Registered Successfully"
        );
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable("userId") String userId){
        return ApiResponses.ok(
                userService.getUserById(userId), String.format(
                        "Fetch User id %s From USERS DB", userId
                )
        );
    }
}
