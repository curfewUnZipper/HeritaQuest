package com.herita.quest.Repository;

import com.herita.quest.Entity.LocationQuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocationQuizQuestionRepo extends JpaRepository<LocationQuizQuestion,Long> {
    List<LocationQuizQuestion> findByQuizId(Long quizId);
}
