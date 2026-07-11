package com.sergiza.chessboard.controller;
import org.springframework.web.bind.annotation.*;
import com.sergiza.chessboard.dto.EvaluationRequest;
import com.sergiza.chessboard.dto.EvaluationResponse;
import com.sergiza.chessboard.dto.OpeningResponse;
import com.sergiza.chessboard.service.StockfishService;
import com.sergiza.chessboard.service.OpeningService;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/chess")
@CrossOrigin(origins = "http://localhost:4200")
public class ChessController {
    @Autowired
    private StockfishService stockfishService;
    @Autowired
    private OpeningService openingService;

    @GetMapping("/health")
    public String health() {
        return "Chess API is running";
    }

    @PostMapping("/evaluate")
    public EvaluationResponse evaluate(@RequestBody EvaluationRequest request) {
        return stockfishService.evaluatePosition(request.getFen());
    }

    @GetMapping("/opening")
    public OpeningResponse getOpening(@RequestParam String moves) {
        OpeningService.OpeningInfo opening = openingService.getOpening(moves);

        if (opening != null) {
            return new OpeningResponse(opening.getEco(), opening.getName(), opening.getMoves());
        }

        return new OpeningResponse("", "Unknown Opening", moves);
    }
}