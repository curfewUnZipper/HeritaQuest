package com.herita.quest.Utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtils {
    public String extractUserName(String token){
        Claims claims=extractAllClaims(token);
        return claims.getSubject();
    }

    private Claims extractAllClaims(String token){
        return Jwts.parser()
                .verifyWith(getSignKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    private String SECRET_KEY ="TaK+HaV^uvCHEFsEVfypW#7g9^k*Z8$V";
    private SecretKey getSignKey(){
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }
    //    ------------------------------------------------------------------
    public boolean validateToken(String token){
        return !isTokenExpired(token);
    }
    private boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }
    private Date extractExpiration(String token){
        return extractAllClaims(token).getExpiration();
    }
    //    -----------------------------------------------------------------
    public String generateToken(String userName){
        Map<String,Object> claims=new HashMap<>();
        return CreateToken(claims,userName);
    }
    private String CreateToken(Map<String,Object> claims,String subject){
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .header().empty().add("typ","JWT")
                .and()
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+1000*60*300))
                .signWith(getSignKey())
                .compact();
    }
//    --------------------------------------------------------------------

}
