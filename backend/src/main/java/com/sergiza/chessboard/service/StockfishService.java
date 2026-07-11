package com.sergiza.chessboard.service;

import com.sergiza.chessboard.dto.EvaluationResponse;
import org.springframework.stereotype.Service;
import java.io.*;

@Service
public class StockfishService {

    private static final String STOCKFISH_PATH = "/usr/games/stockfish";

    public EvaluationResponse evaluatePosition(String fen) {
        try {
            ProcessBuilder pb = new ProcessBuilder(STOCKFISH_PATH);
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream())
            );
            BufferedWriter writer = new BufferedWriter(
                new OutputStreamWriter(process.getOutputStream())
            );

            writer.write("uci\n");
            writer.flush();

            String line;
            while ((line = reader.readLine()) != null) {
                if (line.equals("uciok")) break;
            }

            writer.write("position fen " + fen + "\n");
            writer.write("go depth 15\n");
            writer.flush();

            // Keep the deepest "info ... score ..." line; a finished game only reaches depth 0
            String evaluation = "";
            while ((line = reader.readLine()) != null) {
                if (line.startsWith("info") && line.contains(" score ")) {
                    evaluation = line;
                }
                if (line.startsWith("bestmove")) {
                    break;
                }
            }

            writer.write("quit\n");
            writer.flush();
            process.waitFor();

            return parseEvaluation(evaluation, fen);

        } catch (Exception e) {
            return new EvaluationResponse(0, null, "Error: " + e.getMessage());
        }
    }

    private EvaluationResponse parseEvaluation(String line, String fen) {
    // Format: "info depth 15 ... score cp 25 ..." or "info depth 15 ... score mate 3 ..."
    // Scores come from the side to move's perspective; we normalize to positive = White.

    boolean isWhiteTurn = fen.split(" ")[1].equals("w");

    if (line.contains("score mate")) {
        int mateIn = Integer.parseInt(line.split("score mate ")[1].split(" ")[0]);
        if (!isWhiteTurn) {
            mateIn = -mateIn;
        }
        // "mate 0" means the side to move is already checkmated
        boolean whiteWins = mateIn > 0 || (mateIn == 0 && !isWhiteTurn);
        double score = whiteWins ? 100 : -100;
        String analysis = mateIn == 0 ? "Checkmate" : "Mate in " + Math.abs(mateIn);
        return new EvaluationResponse(score, mateIn, analysis);
    }

    if (line.contains("score cp")) {
        String[] parts = line.split("score cp ");
        if (parts.length > 1) {
            String scorePart = parts[1].split(" ")[0];
            int centipawns = Integer.parseInt(scorePart);
            double pawns = centipawns / 100.0;
            if (!isWhiteTurn) {
                pawns = -pawns;
            }

            return new EvaluationResponse(pawns, null, String.format("Position evaluation: %.2f", pawns));
        }
    }
    return new EvaluationResponse(0, null, "Position evaluation: 0.00");
    }
}
