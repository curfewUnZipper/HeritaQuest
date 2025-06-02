package com.herita.quest.Repository;

import com.herita.quest.Entity.LocationQuiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocationQuizRepo extends JpaRepository<LocationQuiz,Long> {
    List<LocationQuiz> findByUserId(Long userId);
}
