package com.sergiza.chessboard.service;

import com.sergiza.chessboard.dto.FolderDto;
import com.sergiza.chessboard.dto.GameDto;
import com.sergiza.chessboard.dto.SaveGameRequest;
import com.sergiza.chessboard.entity.Folder;
import com.sergiza.chessboard.entity.Game;
import com.sergiza.chessboard.repository.FolderRepository;
import com.sergiza.chessboard.repository.GameRepository;
import com.sergiza.chessboard.repository.GameRepository.FolderGameCount;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class LibraryService {

    private final FolderRepository folderRepository;
    private final GameRepository gameRepository;

    public LibraryService(FolderRepository folderRepository, GameRepository gameRepository) {
        this.folderRepository = folderRepository;
        this.gameRepository = gameRepository;
    }

    public List<FolderDto> getFolders() {
        Map<Long, Long> counts = gameRepository.countGroupedByFolder().stream()
            .collect(Collectors.toMap(FolderGameCount::getFolderId, FolderGameCount::getGameCount));

        return folderRepository.findAll().stream()
            .map(folder -> FolderDto.from(folder, counts.getOrDefault(folder.getId(), 0L)))
            .toList();
    }

    public FolderDto createFolder(String name) {
        if (name == null || name.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Folder name is required");
        }
        if (folderRepository.existsByName(name.trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Folder already exists");
        }
        return FolderDto.from(folderRepository.save(new Folder(name.trim())), 0);
    }

    public void deleteFolder(Long id) {
        gameRepository.deleteByFolderId(id);
        folderRepository.deleteById(id);
    }

    public List<GameDto> getGamesInFolder(Long folderId) {
        if (!folderRepository.existsById(folderId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Folder not found");
        }
        return gameRepository.findByFolderIdOrderByCreatedAtDesc(folderId).stream()
            .map(GameDto::from)
            .toList();
    }

    public GameDto saveGame(SaveGameRequest request) {
        if (request.name() == null || request.name().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Game name is required");
        }
        if (request.folderId() == null || !folderRepository.existsById(request.folderId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Folder not found");
        }
        Game game = new Game(request.name().trim(), request.pgn(), request.folderId());
        return GameDto.from(gameRepository.save(game));
    }

    public void deleteGame(Long id) {
        gameRepository.deleteById(id);
    }
}
