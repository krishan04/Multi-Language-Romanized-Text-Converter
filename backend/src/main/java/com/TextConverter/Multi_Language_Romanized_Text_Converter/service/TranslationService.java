package com.TextConverter.Multi_Language_Romanized_Text_Converter.service;

import com.TextConverter.Multi_Language_Romanized_Text_Converter.entity.TranslationHistory;
import com.TextConverter.Multi_Language_Romanized_Text_Converter.repository.TranslationHistoryRepository;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class TranslationService {

    private final TranslationHistoryRepository translationHistoryRepository;

    // Adjust paths to your Python interpreter and script
    private final String pythonPath = "/Users/krishanlakhotia/Desktop/Projects/Multi-Language-Romanized-Text-Converter/backend/textconverter_env/bin/python3";
    private final String scriptPath = "/Users/krishanlakhotia/Desktop/Projects/Multi-Language-Romanized-Text-Converter/backend/pythonModules/translator_cli.py";

    public TranslationService(TranslationHistoryRepository translationHistoryRepository) {
        this.translationHistoryRepository = translationHistoryRepository;
    }

    public TranslationHistory translateAndSave(MultipartFile file, String plainText, String targetLanguage) {
        TranslationHistory history = new TranslationHistory();
        history.setSourceLang("auto");
        history.setTargetLang(targetLanguage);

        try {
            boolean isFileInput = file != null && !file.isEmpty();
            String filePathString = null;

            // 1. Save uploaded file to Uploads folder if exists
            if (isFileInput) {
                Path uploadDir = Paths.get("Uploads");
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }

                Path filePath = uploadDir.resolve(file.getOriginalFilename());
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                filePathString = filePath.toAbsolutePath().toString();
            }

            // 2. Validate input
            if (!isFileInput && (plainText == null || plainText.isEmpty())) {
                history.setTranslatedText("No input provided");
                return translationHistoryRepository.save(history);
            }

            // 3. Build Python command
            ProcessBuilder pb;
            if (isFileInput) {
                pb = new ProcessBuilder(pythonPath, scriptPath, filePathString, targetLanguage);
            } else {
                pb = new ProcessBuilder(pythonPath, scriptPath, "-", targetLanguage); // "-" means stdin
            }
            pb.redirectErrorStream(true);

            Process process = pb.start();

            // 4. Send plain text via stdin if no file
            if (!isFileInput) {
                try (OutputStreamWriter writer = new OutputStreamWriter(process.getOutputStream(), StandardCharsets.UTF_8)) {
                    writer.write(plainText);
                    writer.flush();
                }
            }

            // 5. Read Python output
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            if (!process.waitFor(2, TimeUnit.MINUTES)) {
                process.destroyForcibly();
                throw new InterruptedException("Translation process timed out.");
            }

            int exitCode = process.exitValue();
            if (exitCode != 0) {
                throw new RuntimeException("Python script failed with exit code " + exitCode + ". Output: " + output);
            }

            // 6. Parse JSON output
            JSONObject json = new JSONObject(output.toString());
            System.out.println(json);

            if (json.has("error")) {
                history.setTranslatedText("Error: " + json.getString("error"));
            } else {
                history.setOriginalText(json.has("original") ? json.getString("original") : plainText);
                history.setTranslatedText(json.getString("translated"));
                history.setRomanizedText(json.getString("romanized"));
                history.setPlainRomanizedText(json.getString("plain_romanized"));
            }

        } catch (Exception e) {
            e.printStackTrace();
            history.setTranslatedText("Translation failed: " + e.getMessage());
        }

        // 7. Save to database
        return translationHistoryRepository.save(history);
    }

    public List<TranslationHistory> getAllTranslationHistory() {
        return translationHistoryRepository.findAll();
    }

    public boolean deleteTranslationHistory(Longs id) {
        if(translationHistoryRepository.existsById(id)){
            translationHistoryRepository.deleteById(id);
            return true;
        }
        return false;
    }
}