package com.TextConverter.Multi_Language_Romanized_Text_Converter.repository;

import com.TextConverter.Multi_Language_Romanized_Text_Converter.entity.TranslationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TranslationHistoryRepository extends JpaRepository<TranslationHistory, Long> {

}
