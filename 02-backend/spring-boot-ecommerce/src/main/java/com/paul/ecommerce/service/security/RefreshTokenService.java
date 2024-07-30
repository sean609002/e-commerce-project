package com.paul.ecommerce.service.security;

import com.paul.ecommerce.Entity.authentication.RefreshToken;
import java.util.Optional;


public interface RefreshTokenService {
    public Optional<RefreshToken> findByToken(String token);

    public RefreshToken createRefreshToken(Long userId);

    public RefreshToken verifyExpiration(RefreshToken token);

    public void deleteByUserId(Long userId);
}
