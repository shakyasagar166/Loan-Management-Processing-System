package com.loan.service;

import com.loan.dto.JwtAuthResponse;
import com.loan.dto.LoginRequest;
import com.loan.dto.RegisterRequest;

public interface AuthService {
    JwtAuthResponse login(LoginRequest loginRequest);
    JwtAuthResponse register(RegisterRequest registerRequest);
}
