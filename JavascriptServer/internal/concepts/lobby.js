import trace from '#util/logging';
import Room  from '#concepts/room';
import { EventEmitter } from 'events';
import * as crypto from 'crypto';
import Board from './board.js';
import { oppositeColor, PIECE_COLOR } from '../types/piece_consts.js';


export function lobbyCreate() {
    var lobby = new Lobby();
    
    while (true) {
        // a random 6-digit number
        var lobbyid = crypto.randomInt(100000, 999999).toString();
        if (lobbyid in global.lobbies) { // just in case of a collision
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

export function lobbyGet(lobbyid) {
    return global.lobbies[lobbyid];
}

export function lobbyExists(lobbyid) {
    return global.lobbies.hasOwnProperty(lobbyid);
}

export function lobbyDelete(lobbyid) {
    var lobby = global.lobbies[lobbyid];
    lobby.close();
    
    delete global.lobbies[lobbyid];
}

export function lobbyList() {
    return (Object.values(global.lobbies));
}


// in context of an MMO this is a shard/separated world
export default class Lobby extends EventEmitter {
    lobbyid = "-1"; // assigned when created
    status = 'open';
    players = [];
    /** @type {Board} */
    board = null;
    rooms = [];
    max_players = global.config.lobby.max_players || undefined; // smells like Java
    
    constructor() {
        super();
        
        if (global.config.rooms_enabled) {
            for (let i = 0; i < global.maps.length; i++) {
                let map = global.maps[i];
                let room = new Room(map, this);
                this.rooms.push(room);
            }
        }
        else {
            this.rooms = null;
        }

        this.board = new Board();
    }
    
    addPlayer(player) {
        if (this.full) {
            trace('warning: can\'t add a player - the lobby is full!');
            player.onLobbyReject(this, 'lobby is full!');
            return -1;
        }
        else if (this.players.indexOf(player) !== -1) {
            trace('warning: can\'t add a player who\'s already in the lobby');
            player.onLobbyReject(this, 'already in the lobby');
            return -1;
        }
        else if (player.lobby !== null) {
            player.lobby.kickPlayer(player, 'changing lobbies', false);
        }
        else if (global.config.necessary_login && !player.logged_in) {
            trace('warning: can\'t add a player who\'s not logged in');
            player.onLobbyReject(this, 'login to join a lobby!');
            return -1;
        }
        
        this.players.push(player);
        player.lobby = this;
        player.onLobbyJoin(this);
        
        
        // lobby is now full - add everyone
        if (global.config.lobby.addIntoPlayOnFull && this.players.length == this.max_players) {
            this.play();
            // this.players.forEach(p => this.addIntoPlay(p));
        }
        else if (!global.config.lobby.addIntoPlayOnFull) {
            // immediately add into play
            this.addIntoPlay(player);
        }
    }
    
    kickPlayer(player, reason, forced) {
        var idx = this.players.indexOf(player);
        this.players.splice(idx, 1);
        player.room?.removePlayer(player); // if in a room - kick, otherwise don't error out
        player.onLobbyLeave(this, reason, forced);
        player.lobby = null;
        
        
        // close if a player leaves from the lobby?
        if (global.config.lobby.closeOnLeave) {
            this.close();
        }

        if (this.player_count == 1 && this.status == 'playing') {
            this.gameEnd(oppositeColor(player.color), 'disconnect');
        }
        else { // 0 players left
            // reset the lobby
            this.board = new Board();
            this.status = 'open';
        }
    }
    
    addIntoPlay(player) {
        if (player.lobby === this) {
            player.onPlay();
        }
        else {
            trace('something went wrong - trying to add into play a player not from this lobby');
        }
    }
    
    findRoomByMapName(room_name) {
        return this.rooms.find(r => r.map.name === room_name);
    }
    
    broadcast(data) {
        this.players.forEach(function (player) {
            player.write(data);
        });
    }
    
    play() {
        var lobby = this;
        this.players.forEach(function (player) {
            lobby.addIntoPlay(player);
        });

        this.players[0].color = Math.random() > .5 ? PIECE_COLOR.White : PIECE_COLOR.Black;
        this.players[1].color = oppositeColor(this.players[0].color);

        this.status = 'playing';

        this.players.forEach(p => {
            p.playing = true;
            p.sendColor();
        });
        this.broadcast({ cmd: 'board', board: this.board.toString() });
    }

    handleGameOver() {
        if (this.board.isInsufficientMaterial()) {
            return this.gameEnd(null, 'insufficient material');
        }

        this.players.forEach((player) => {
            if (this.board.isCheckmated(player.color)) {
                this.gameEnd(oppositeColor(player.color), 'checkmate');
            }
            else if (this.board.isStalemated(player.color)) {
                this.gameEnd(null, 'stalemate');
            }
        }, this);
    }

    gameEnd(winner, reason) {
        this.status = 'game over';

        if (winner === null) {
            // draw
            this.broadcast({ cmd: 'game over', winner, reason, message: 'Draw' });
        }
        else {
            this.broadcast({ cmd: 'game over', winner, reason, message: `${winner == PIECE_COLOR.White ? 'White' : 'Black'} won` });
        }
    }
    
    close() {
        // kick all players
        this.players.forEach((player) => this.kickPlayer(player, 'lobby is closing!', true));
        this.status = 'closed';
    }
    
    
    // data that is being sent about this lobby
    // (e.x. we don't want to send functions and everything about every player)
    serialize() {
        return {
            lobbyid: this.lobbyid,
            rooms: global.config.rooms_enabled
                ? this.rooms.map(r => r.serialize())
                : undefined,
            status: this.status,
            max_players: this.max_players,
            player_count: this.player_count,
            full: this.full
        };
    }
    
    getInfo() {
        return {
            lobbyid: this.lobbyid,
            rooms: global.config.rooms_enabled
                ? this.rooms.map(r => r.getInfo())
                : undefined,
            status: this.status,
            max_players: this.max_players,
            player_count: this.player_count,
            full: this.full
        };
    }
    
    get player_count() {
        return this.players.length;
    }
    
    get full() {
        return this.player_count >= this.max_players;
    }
    
    get empty() {
        return this.player_count == 0;
    }
}
