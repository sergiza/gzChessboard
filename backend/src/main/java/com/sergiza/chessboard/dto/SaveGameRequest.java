package com.sergiza.chessboard.dto;

public record SaveGameRequest(String name, String pgn, Long folderId) {}
