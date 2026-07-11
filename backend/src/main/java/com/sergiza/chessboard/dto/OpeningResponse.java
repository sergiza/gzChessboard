package com.sergiza.chessboard.dto;

public class OpeningResponse {
    private String eco;
    private String name;
    private String moves;

    public OpeningResponse(String eco, String name, String moves) {
        this.eco = eco;
        this.name = name;
        this.moves = moves;
    }

    public String getEco() { return eco; }
    public void setEco(String eco) { this.eco = eco; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getMoves() { return moves; }
    public void setMoves(String moves) { this.moves = moves; }
}