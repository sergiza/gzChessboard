package com.sergiza.chessboard.controller;

import com.sergiza.chessboard.dto.CreateFolderRequest;
import com.sergiza.chessboard.dto.FolderDto;
import com.sergiza.chessboard.dto.GameDto;
import com.sergiza.chessboard.dto.SaveGameRequest;
import com.sergiza.chessboard.service.LibraryService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class LibraryController {

    private final LibraryService libraryService;

    public LibraryController(LibraryService libraryService) {
        this.libraryService = libraryService;
    }

    @GetMapping("/folders")
    public List<FolderDto> getFolders() {
        return libraryService.getFolders();
    }

    @PostMapping("/folders")
    public FolderDto createFolder(@RequestBody CreateFolderRequest request) {
        return libraryService.createFolder(request.name());
    }

    @DeleteMapping("/folders/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFolder(@PathVariable Long id) {
        libraryService.deleteFolder(id);
    }

    @GetMapping("/folders/{id}/games")
    public List<GameDto> getGamesInFolder(@PathVariable Long id) {
        return libraryService.getGamesInFolder(id);
    }

    @PostMapping("/games")
    public GameDto saveGame(@RequestBody SaveGameRequest request) {
        return libraryService.saveGame(request);
    }

    @DeleteMapping("/games/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteGame(@PathVariable Long id) {
        libraryService.deleteGame(id);
    }
}
