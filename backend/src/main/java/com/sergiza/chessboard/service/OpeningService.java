package com.sergiza.chessboard.service;

import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

// 1. Loads all TSV files on startup (@PostConstruct)
// 2. Parses them into a HashMap (moves → opening info)
// 3. getOpening(moves) finds the best match
@Service
public class OpeningService {

    private Map<String, OpeningInfo> openingsMap = new HashMap<>();

    @PostConstruct
    public void loadOpenings() {
        String[] files = {"a.tsv", "b.tsv", "c.tsv", "d.tsv", "e.tsv"};

        for (String file : files) {
            loadTsvFile("/openings/" + file);
        }

        System.out.println("Loaded " + openingsMap.size() + " openings");
    }

    // OLD LOAD, INCLUDES NUMBER
//    private void loadTsvFile(String resourcePath) {
//        try (InputStream is = getClass().getResourceAsStream(resourcePath);
//             BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
//
//            // Skip header line
//            reader.readLine();
//
//            String line;
//            while ((line = reader.readLine()) != null) {
//                String[] parts = line.split("\t");
//                if (parts.length >= 3) {
//                    String eco = parts[0].trim();
//                    String name = parts[1].trim();
//                    String moves = parts[2].trim();
//
//                    openingsMap.put(moves, new OpeningInfo(eco, name, moves));
//                }
//            }
//        } catch (Exception e) {
//            System.err.println("Error loading " + resourcePath + ": " + e.getMessage());
//        }
//    }
    private void loadTsvFile(String resourcePath) {
        try (InputStream is = getClass().getResourceAsStream(resourcePath);
             BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {

            // Skip header line
            reader.readLine();

            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split("\t");
                if (parts.length >= 3) {
                    String eco = parts[0].trim();
                    String name = parts[1].trim();
                    String moves = parts[2].trim();

                    // Strip move numbers (e.g., "1. e4 e5" -> "e4 e5")
                    moves = moves.replaceAll("\\d+\\.\\s*", "");

                    openingsMap.put(moves, new OpeningInfo(eco, name, moves));
                }
            }
        } catch (Exception e) {
            System.err.println("Error loading " + resourcePath + ": " + e.getMessage());
        }
    }

    public OpeningInfo getOpening(String moves) {
        // Try exact match first
        if (openingsMap.containsKey(moves)) {
            return openingsMap.get(moves);
        }

        // Try to find longest matching prefix
        OpeningInfo longestMatch = null;
        int longestLength = 0;

        for (Map.Entry<String, OpeningInfo> entry : openingsMap.entrySet()) {
            String key = entry.getKey();
            if (moves.startsWith(key) && key.length() > longestLength) {
                longestMatch = entry.getValue();
                longestLength = key.length();
            }
        }

        return longestMatch;
    }

    // Inner class for opening data
    public static class OpeningInfo {
        private String eco;
        private String name;
        private String moves;

        public OpeningInfo(String eco, String name, String moves) {
            this.eco = eco;
            this.name = name;
            this.moves = moves;
        }

        public String getEco() { return eco; }
        public String getName() { return name; }
        public String getMoves() { return moves; }
    }
}