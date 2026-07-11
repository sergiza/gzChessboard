package com.sergiza.chessboard.dto;

import com.sergiza.chessboard.entity.Game;
import java.time.LocalDateTime;

public record GameDto(Long id, String name, String pgn, Long folderId, LocalDateTime createdAt) {

    public static GameDto from(Game game) {
        return new GameDto(game.getId(), game.getName(), game.getPgn(), game.getFolderId(), game.getCreatedAt());
    }
}
