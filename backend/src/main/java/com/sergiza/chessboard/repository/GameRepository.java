package com.sergiza.chessboard.repository;

import com.sergiza.chessboard.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long> {

    List<Game> findByFolderIdOrderByCreatedAtDesc(Long folderId);

    void deleteByFolderId(Long folderId);

    interface FolderGameCount {
        Long getFolderId();
        long getGameCount();
    }

    @Query("select g.folderId as folderId, count(g) as gameCount from Game g group by g.folderId")
    List<FolderGameCount> countGroupedByFolder();
}
