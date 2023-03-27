import Lobby from '#concepts/lobby';
import * as crypto from 'crypto';

export function createLobby() {
    var lobby = new Lobby();
    
    while (true) {
        // a random 6-digit number
        var lobbyid = crypto.randomInt(100000, 999999).toString();
        if (lobbyid in global.lobbies) {
            continue;
        }
        else {
            global.lobbies[lobbyid] = lobby;
            lobby.lobbyid = lobbyid;
            break;
        }
    }
    
    return lobby;
}

export function findLobby(lobbyid) {
    // changed the implementation to objects/structs instead of arrays
    return global.lobbies[lobbyid];
}

export function deleteLobby(lobbyid) {
    var lobby = global.lobbies[lobbyid];
    lobby.close();
    
    delete global.lobbies[lobbyid];
}
