package com.TextConverter.Multi_Language_Romanized_Text_Converter.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsFilterConfig {

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE) // Ensures this runs before Spring Security or MVC
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList(
                "https://multi-language-romanized-text-converter-3lck.onrender.com",
                "http://localhost:5173"
        ));
        config.setAllowedHeaders(Arrays.asList(
                "Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"
        ));
        config.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));
        config.addExposedHeader("Access-Control-Allow-Origin");
        config.addExposedHeader("Access-Control-Allow-Credentials");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}