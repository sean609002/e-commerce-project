package com.paul.ecommerce.controller;

import com.alibaba.fastjson.JSONObject;
import com.paul.ecommerce.Entity.authentication.ERole;
import com.paul.ecommerce.Entity.authentication.RefreshToken;
import com.paul.ecommerce.Entity.authentication.Role;
import com.paul.ecommerce.Entity.authentication.User;
import com.paul.ecommerce.dto.authentication.LoginRequest;
import com.paul.ecommerce.dto.authentication.MessageResponse;
import com.paul.ecommerce.dto.authentication.SignupRequest;
import com.paul.ecommerce.dto.authentication.UserInfoResponse;
import com.paul.ecommerce.exception.TokenRefreshException;
import com.paul.ecommerce.exception.UserNotFoundException;
import com.paul.ecommerce.jwt.JwtUtils;
import com.paul.ecommerce.service.security.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;

    private final UserService userService;

    private final RoleService roleService;

    private final PasswordEncoder encoder;

    private final JwtUtils jwtUtils;

    private final RefreshTokenService refreshTokenService;

    @Value("${myoauth.github.client.id}")
    private String CLIENT_ID;

    @Value("${myoauth.github.client.secret}")
    private String CLIENT_SECRET;

    @Value("${myoauth.github.callback}")
    private String CALLBACK;

    @Value("${myoauth.github.callback.register.url}")
    private String CALLBACK_REGISTER_URL;

    @Value("${myoauth.github.callback.login.url}")
    private String CALLBACK_LOGIN_URL;

    @Value("${myoauth.github.callback.auth-redirect.url}")
    private String CALLBACK_AUTH_REDIRECT_URL;


    @Autowired
    public AuthController(AuthenticationManager authenticationManager, UserService userService, RoleService roleService, PasswordEncoder encoder, JwtUtils jwtUtils, RefreshTokenService refreshTokenService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.roleService = roleService;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
        this.refreshTokenService = refreshTokenService;
    }

    @GetMapping("/token")
    public ResponseEntity<?> getTokenByQueryString(HttpServletRequest req) {
        String jwt = req.getParameter("acc");
        String ref = req.getParameter("ref");
        ResponseCookie jwtCookie;
        ResponseCookie refCookie;
        try{
            if(jwt != null && ref != null) {
                jwtUtils.validateJwtToken(jwt);
                jwtCookie = jwtUtils.generateJwtCookie(jwt);
                refCookie = jwtUtils.generateRefreshJwtCookie(ref);
                return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                        .header(HttpHeaders.SET_COOKIE, refCookie.toString()).body(new MessageResponse("successfully get access token and refresh token"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("jwt modified"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("both access token and refresh token are required"));
    }

    @GetMapping("/github")
    public ResponseEntity<?> callback(String code, String state) throws Exception {
        HttpHeaders headers;
        if(!StringUtils.isEmpty(code) && !StringUtils.isEmpty(state)) {
            String tokenUrl = GitHubConstants.TOKEN_URL.replace("CLIENT_ID", CLIENT_ID)
                    .replace("CLIENT_SECRET", CLIENT_SECRET)
                    .replace("CODE", code)
                    .replace("CALLBACK", CALLBACK);
            String responseStr = HttpClientUtils.doGet(tokenUrl);
            String token = HttpClientUtils.parseResponseEntity(responseStr).get("access_token");
            responseStr = HttpClientUtils.doGet(GitHubConstants.USER_INFO_URL, token);//json
            Map<String, String> responseMap = HttpClientUtils.parseResponseEntityJSON(responseStr);
            //判斷username或是email存在於我們後端的user table
            String userName = responseMap.get("login");
            String email = responseMap.get("email");
            //如果存在的話，就要重新導向到前端的oauth-redirect，並在query string帶上jwt以及UUID(refresh token)
            if(email != null && userService.existsByEmail(email)) {
                User user = userService.findByEmail(email).orElseThrow(() -> new UserNotFoundException(email));
                headers = callbackHelper(user);
                return ResponseEntity.status(HttpStatus.MOVED_PERMANENTLY).headers(headers).body(new MessageResponse("redirect..."));
            }else if(userName != null && userService.existsByUsername(userName)) {
                User user = userService.findByUserName(userName).orElseThrow(() -> new UsernameNotFoundException(userName + " not found"));
                headers = callbackHelper(user);
                return ResponseEntity.status(HttpStatus.MOVED_PERMANENTLY).headers(headers).body(new MessageResponse("redirect..."));
            } else { //如果不存在，就要導向註冊頁面，並加上query String username=?&email=?
                headers = new HttpHeaders();
                headers.add("Location", CALLBACK_REGISTER_URL.replace("USERNAME", userName).replace("EMAIL", email));
                return new ResponseEntity<>(headers, HttpStatus.MOVED_PERMANENTLY);
            }
        }
        //導向到login頁面
        headers = new HttpHeaders();
        headers.add("Location", CALLBACK_LOGIN_URL);
        return new ResponseEntity(headers, HttpStatus.MOVED_PERMANENTLY);
    }

    public HttpHeaders callbackHelper(User user) {
        String jwt = jwtUtils.generateTokenFromUsername(user.getUsername());
        //刪除refresh token
        refreshTokenService.deleteByUserId(user.getId());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());
        //重定向到oauth-redirect
        HttpHeaders headers = new HttpHeaders();
        headers.set("Location", CALLBACK_AUTH_REDIRECT_URL.replace("ACC", jwt).replace("REF", refreshToken.getToken()));
        return headers;
    }
    //Github常數工具類
    static class GitHubConstants {
        //public static final String CLIENT_ID = AuthController.CLIENT_ID;
        //public static final String CLIENT_SECRET = AuthController.CLIENT_SECRET;
        //public static final String CALLBACK = AuthController.CALLBACK;

        //獲取code的url
        public static final String CODE_URL = "https://github.com/login/oauth/authorize?client_id=CLIENT_ID&state=STATE&redirect_uri=CALLBACK";
        //獲取token的url
        public static final String TOKEN_URL = "https://github.com/login/oauth/access_token?client_id=CLIENT_ID&client_secret=CLIENT_SECRET&code=CODE&redirect_uri=CALLBACK";
        //獲取用户資訊的url
        public static final String USER_INFO_URL = "https://api.github.com/user";
    }

    //HttpRequest工具類
    static class HttpClientUtils {
        public static String doGet(String url) throws Exception {
            CloseableHttpClient httpclient = HttpClients.createDefault();
            HttpGet httpGet = new HttpGet(url);
            CloseableHttpResponse response = httpclient.execute(httpGet); //發送http請求
            //如果響應成功，解析響應結果
            if (response.getStatusLine().getStatusCode() == 200) {
                HttpEntity responseEntity = response.getEntity(); //獲取響應內容
                return EntityUtils.toString(responseEntity);
            }
            response.close();
            return null;
        }

        public static String doGet(String url, String accessToken) throws Exception {
            CloseableHttpClient httpclient = HttpClients.createDefault();
            HttpGet httpGet = new HttpGet(url);
            //在請求頭加上 Authorization
            httpGet.setHeader("Authorization", "Bearer " + accessToken);
            CloseableHttpResponse response = httpclient.execute(httpGet); //發送http請求
            //如果響應成功，解析響應結果
            if (response.getStatusLine().getStatusCode() == 200) {
                HttpEntity responseEntity = response.getEntity(); // 獲取響應內容
                return EntityUtils.toString(responseEntity);
            }
            response.close();
            return null;
        }

        // 参數的封装
        public static Map<String, String> parseResponseEntity(String responseEntityStr) {
            Map<String, String> map = new HashMap<>();
            String[] strs = responseEntityStr.split("\\&");
            for (String str : strs) {
                String[] mapStrs = str.split("=");
                String value = null;
                String key = mapStrs[0];
                if (mapStrs.length > 1) {
                    value = mapStrs[1];
                }
                map.put(key, value);
            }
            return map;
        }

        //json字串轉map
        public static Map<String, String> parseResponseEntityJSON(String responseEntityStr) {
            Map<String, String> map = new HashMap<>();
            JSONObject jsonObject = JSONObject.parseObject(responseEntityStr); //解析json格式的字串
            Set<Map.Entry<String, Object>> entries = jsonObject.entrySet();
            for (Map.Entry<String, Object> entry : entries) {
                String key = entry.getKey();
                String value = String.valueOf(entry.getValue());
                map.put(key, value);
            }
            return map;
        }
    }


    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        //驗證
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        //根據authentication object生成jwt token
        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);

        //in case people didn't sign out, we delete refresh token if exists
        refreshTokenService.deleteByUserId(userDetails.getId());

        //生成refresh token後生成refresh token cookie
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());
        ResponseCookie jwtRefreshCookie = jwtUtils.generateRefreshJwtCookie(refreshToken.getToken());


        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .header(HttpHeaders.SET_COOKIE, jwtRefreshCookie.toString())
                .body(new UserInfoResponse(userDetails.getId(),
                        userDetails.getFirstName(),
                        userDetails.getLastName(),
                        userDetails.getUsername(),
                        userDetails.getEmail(),
                        roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userService.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userService.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getFirstName(),
                signUpRequest.getLastName(),
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleService.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleService.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    case "mod":
                        Role modRole = roleService.findByName(ERole.ROLE_MODERATOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);

                        break;
                    default:
                        Role userRole = roleService.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userService.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/signout")
    public ResponseEntity<?> logoutUser() {
        Object principle = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(principle.toString(), "anonymousUser")) {
            Long userId = ((UserDetailsImpl) principle).getId();
            refreshTokenService.deleteByUserId(userId);
        }
        ResponseCookie cookie = jwtUtils.getCleanJwtCookie();
        ResponseCookie jwtRefreshCookie = jwtUtils.getCleanJwtRefreshCookie();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
                .header(HttpHeaders.SET_COOKIE, jwtRefreshCookie.toString())
                .body(new MessageResponse("You've been signed out!"));
    }

    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshtoken(HttpServletRequest request) {
        String refreshToken = jwtUtils.getJwtRefreshFromCookies(request);

        if ((refreshToken != null) && (refreshToken.length() > 0)) {
            return refreshTokenService.findByToken(refreshToken)
                    .map(refreshTokenService::verifyExpiration)
                    .map(RefreshToken::getUser)
                    .map(user -> {
                        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(user);

                        return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                                .body(new MessageResponse("Token is refreshed successfully!"));
                    })
                    .orElseThrow(() -> new TokenRefreshException(refreshToken,
                            "Refresh token is not in database!"));
        }

        return ResponseEntity.badRequest().body(new MessageResponse("Refresh Token is empty!"));
    }
}