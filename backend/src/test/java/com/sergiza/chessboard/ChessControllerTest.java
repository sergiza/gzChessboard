package com.sergiza.chessboard;

import com.sergiza.chessboard.dto.EvaluationResponse;
import com.sergiza.chessboard.service.StockfishService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ChessControllerTest {

    @Autowired
    private StockfishService stockfishService;

    @Test
    public void testStockfishEvaluation() {
        String fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        EvaluationResponse result = stockfishService.evaluatePosition(fen);

        assertNotNull(result);
        assertNull(result.getMateIn());
        assertFalse(result.getAnalysis().contains("Error"));
    }

    @Test
    public void testStockfishMateDetection() {
        // White mates in one with Ra8#
        String fen = "6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1";
        EvaluationResponse result = stockfishService.evaluatePosition(fen);

        assertEquals(1, result.getMateIn());
        assertTrue(result.getScore() > 0);
    }
}
