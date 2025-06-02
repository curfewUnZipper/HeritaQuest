package com.herita.quest.Repository;

import com.herita.quest.Entity.FBQuiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


public interface FbQuizRepo extends JpaRepository<FBQuiz,Long> {
}
