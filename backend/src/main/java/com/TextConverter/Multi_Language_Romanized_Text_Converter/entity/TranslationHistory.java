package com.TextConverter.Multi_Language_Romanized_Text_Converter.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "translation_history")
public class TranslationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String originalText;

    @Column(columnDefinition = "TEXT")
    private String translatedText;

    @Column(columnDefinition = "TEXT")
    private String romanizedText;

    @Column(columnDefinition = "TEXT")
    private String plainRomanizedText;

    private String sourceLang;
    private String targetLang;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

}
