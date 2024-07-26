package com.paul.ecommerce.service.security;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import com.paul.ecommerce.Entity.authentication.RefreshToken;
import com.paul.ecommerce.Entity.authentication.User;
import com.paul.ecommerce.dao.authentication.RefreshTokenRepository;
import com.paul.ecommerce.dao.authentication.UserRepository;
import com.paul.ecommerce.exception.TokenRefreshException;
import com.paul.ecommerce.exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {
    @Value("${app.jwtRefreshExpirationMs}")
    private Long refreshTokenDurationMs;

    private final RefreshTokenRepository refreshTokenRepository;

    private final UserRepository userRepository;

    @Autowired
    public RefreshTokenServiceImpl(RefreshTokenRepository refreshTokenRepository, UserRepository userRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken createRefreshToken(Long userId) {
        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setUser(userRepository.findById(userId).get());
        refreshToken.setExpiryDate(new Date(System.currentTimeMillis() + refreshTokenDurationMs));
        refreshToken.setToken(UUID.randomUUID().toString());

        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(new Date(System.currentTimeMillis())) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token was expired. Please make a new signin request");
        }

        return token;
    }

    @Transactional
    public void deleteByUserId(Long userId) {
        boolean ifUserExists = userRepository.findById(userId).isPresent();
        if (ifUserExists) {
            refreshTokenRepository.deleteByUserId(userId);
        } else {
            throw new UserNotFoundException("user with id:"+ userId + " is not found");
        }
        //return refreshTokenRepository.deleteByUser(userRepository.findById(userId).get());
    }
}