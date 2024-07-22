package com.paul.ecommerce.service.security;

import com.paul.ecommerce.Entity.authentication.RefreshToken;
import com.paul.ecommerce.exception.TokenRefreshException;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenService {
    public Optional<RefreshToken> findByToken(String token);

    public RefreshToken createRefreshToken(Long userId);

    public RefreshToken verifyExpiration(RefreshToken token);

    public int deleteByUserId(Long userId);
}
