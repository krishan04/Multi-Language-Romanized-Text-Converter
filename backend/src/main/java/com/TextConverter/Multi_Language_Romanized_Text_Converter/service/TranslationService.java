package com.TextConverter.Multi_Language_Romanized_Text_Converter.service;

import com.TextConverter.Multi_Language_Romanized_Text_Converter.entity.TranslationHistory;
import com.TextConverter.Multi_Language_Romanized_Text_Converter.repository.TranslationHistoryRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class TranslationService {

    private final TranslationHistoryRepository translationHistoryRepository;
    private final String pythonPath = "/Users/krishanlakhotia/Desktop/Projects/Multi-Language-Romanized-Text-Converter/textconverter_env/bin/python3"; // Adjust to your Python interpreter path
    private final String scriptPath = "/Users/krishanlakhotia/Desktop/Projects/Multi-Language-Romanized-Text-Converter/pythonModules/translator_cli.py"; // Adjust script path

    public TranslationService(TranslationHistoryRepository translationHistoryRepository) {
        this.translationHistoryRepository = translationHistoryRepository;
    }

    public String extractTextFromPDF(MultipartFile file) throws IOException {
        byte[] fileBytes = file.getInputStream().readAllBytes();
        try (PDDocument document = Loader.loadPDF(fileBytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    public TranslationHistory translateAndSave(MultipartFile pdfFile, String plainText, String targetLanguage) {
        TranslationHistory history = new TranslationHistory();
        String originalText = "";

        try {
            // 1. Get input text
            if (pdfFile != null && !pdfFile.isEmpty()) {
                originalText = extractTextFromPDF(pdfFile);
            } else if (plainText != null && !plainText.isEmpty()) {
                originalText = plainText;
            } else {
                history.setTranslatedText("No input provided");
                return history;
            }

            history.setOriginalText(originalText);
            history.setSourceLang("auto");
            history.setTargetLang(targetLanguage);

            // 2. Call Python process
            ProcessBuilder pb = new ProcessBuilder(pythonPath, scriptPath, targetLanguage);
            pb.redirectErrorStream(true); // merge stderr into stdout for debugging
            Process process = pb.start();

            // Send original text to Python via stdin
            try (OutputStreamWriter writer = new OutputStreamWriter(process.getOutputStream(), StandardCharsets.UTF_8)) {
                writer.write(originalText);
                writer.flush();
            }

            // 3. Read Python output
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            // 4. Ensure process finished
            if (!process.waitFor(2, TimeUnit.MINUTES)) {
                process.destroyForcibly();
                throw new InterruptedException("Translation process timed out.");
            }

            int exitCode = process.exitValue();
            if (exitCode != 0) {
                throw new RuntimeException("Python script failed with exit code " + exitCode + ". Output: " + output);
            }

            System.out.println("Python raw output: " + output);
            // 5. Parse JSON output
            // Extract JSON part from the string
            JSONObject json = new JSONObject(output.toString());

            if (json.has("error")) {
                history.setTranslatedText("Error: " + json.getString("error"));
            } else {
                history.setTranslatedText(json.getString("translated"));
                history.setRomanizedText(json.getString("romanized"));
                history.setPlainRomanizedText(json.getString("plain_romanized"));
            }

        } catch (Exception e) {
            e.printStackTrace();
            history.setTranslatedText("Translation failed: " + e.getMessage());
        }

        // 6. Save history in DB
        return translationHistoryRepository.save(history);
    }

    public List<TranslationHistory> getAllTranslationHistory() {
        return translationHistoryRepository.findAll();
    }
}