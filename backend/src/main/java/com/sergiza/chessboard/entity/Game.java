package com.sergiza.chessboard.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "games")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String pgn;

    @Column(name = "folder_id", nullable = false)
    private Long folderId;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Game() {}

    public Game(String name, String pgn, Long folderId) {
        this.name = name;
        this.pgn = pgn;
        this.folderId = folderId;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPgn() { return pgn; }
    public void setPgn(String pgn) { this.pgn = pgn; }
    public Long getFolderId() { return folderId; }
    public void setFolderId(Long folderId) { this.folderId = folderId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
