package com.sergiza.chessboard.repository;

import com.sergiza.chessboard.entity.Folder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FolderRepository extends JpaRepository<Folder, Long> {

    boolean existsByName(String name);
}
