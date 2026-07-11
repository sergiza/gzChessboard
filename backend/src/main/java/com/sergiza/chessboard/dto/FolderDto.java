package com.sergiza.chessboard.dto;

import com.sergiza.chessboard.entity.Folder;

public record FolderDto(Long id, String name, long gameCount) {

    public static FolderDto from(Folder folder, long gameCount) {
        return new FolderDto(folder.getId(), folder.getName(), gameCount);
    }
}
