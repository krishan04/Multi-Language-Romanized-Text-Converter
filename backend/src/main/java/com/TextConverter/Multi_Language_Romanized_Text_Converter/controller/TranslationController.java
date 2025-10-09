package com.TextConverter.Multi_Language_Romanized_Text_Converter.controller;

import com.TextConverter.Multi_Language_Romanized_Text_Converter.entity.TranslationHistory;
import com.TextConverter.Multi_Language_Romanized_Text_Converter.service.TranslationService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

//@CrossOrigin(origins = {
//        "https://multi-language-romanized-text-conve.vercel.app", // ✅ Your Vercel frontend
//        "https://multi-language-romanized-text-converter-3lck.onrender.com", // ✅ Render frontend (if used)
//        "http://localhost:5173", // ✅ Local dev
//        "http://localhost:3000"  // ✅ Optional local React
//},
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PUT, RequestMethod.OPTIONS})

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

    @GetMapping("/history")
    public List<TranslationHistory> getHistory(){
        List<TranslationHistory> history = translationService.getAllTranslationHistory();
//        ResponseEntity.ok(history);
        return history;
    }

    @DeleteMapping("history/{id}")
    public ResponseEntity<String> deleteHistory(@PathVariable("id") Long id){
        boolean deleted = translationService.deleteTranslationHistory(id);
        if(deleted){
            return ResponseEntity.ok("Deleted TranslationHistory");
        }
        else{
            return ResponseEntity.status(404).body("TranslationHistory not found");
        }
    }
}
