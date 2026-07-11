package com.sergiza.chessboard.dto;

public class EvaluationResponse {
    private double score;
    private Integer mateIn;   // moves until mate (positive = White mates), null when there is no forced mate
    private String analysis;

    public EvaluationResponse(double score, Integer mateIn, String analysis) {
        this.score = score;
        this.mateIn = mateIn;
        this.analysis = analysis;
    }

    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }

    public Integer getMateIn() { return mateIn; }
    public void setMateIn(Integer mateIn) { this.mateIn = mateIn; }

    public String getAnalysis() { return analysis; }
    public void setAnalysis(String analysis) { this.analysis = analysis; }
}
