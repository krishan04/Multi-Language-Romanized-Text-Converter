package com.TextConverter.Multi_Language_Romanized_Text_Converter.controller;

import com.TextConverter.Multi_Language_Romanized_Text_Converter.entity.TranslationHistory;
import com.TextConverter.Multi_Language_Romanized_Text_Converter.service.TranslationService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api")
public class TranslationController {

    private final TranslationService translationService;

    public TranslationController(TranslationService translationService) {
        this.translationService = translationService;
    }

    @PostMapping("/translate")
    public TranslationHistory translate(@RequestParam(value = "file", required = false) MultipartFile file,
                                        @RequestParam(value = "text", required = false) String text,
                                        @RequestParam("language") String targetLanguage) {

        targetLanguage = targetLanguage.trim().toLowerCase();
        System.out.println("Language: "+targetLanguage);
        return translationService.translateAndSave(file, text, targetLanguage);
    }

    @GetMapping("/History")
    public List<TranslationHistory> getHistory(){
        List<TranslationHistory> history = translationService.getAllTranslationHistory();
        ResponseEntity.ok(history);
        return history;
    }

}
