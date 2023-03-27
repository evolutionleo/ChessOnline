import * as crypto from 'crypto';

// use this instead of calling the new Party() contructor directly
export function partyCreate(leader) {
    const party = new Party(leader);
    
    while (true) {
        // a random 6-digit number
        let partyid = crypto.randomInt(100000, 999999).toString();
        if (partyid in global.parties) { // just in case of a collision
            continue;
        }
        else {
            global.parties[partyid] = party;
            party.partyid = partyid;
            break;
        }
    }
    
    return party;
}

export function partyGet(partyid) {
    return global.parties[partyid];
}

export function partyExists(partyid) {
    return global.parties.hasOwnProperty(partyid);
}

export function partyDelete(partyid) {
    let party = global.parties[partyid];
    party.disband();
}


export default class Party {
    partyid;
    members;
    leader;
    max_members; // inherited from config.party.max_members
    
    constructor(leader) {
        this.members = [];
        this.max_members = global.config.party.max_members;
        
        this.addMember(leader);
        this.leader = leader;
    }
    
    addMember(member) {
        if (member.party === this)
            return;
        else if (this.members.length >= this.max_members) {
            member.onPartyReject(this, 'party full');
            return;
        }
        else if (member.party) {
            member.party.kickMember(member, 'changing parties', true);
        }
        
        if (!this.isMember(member)) {
            this.members.push(member);
            member.party = this;
        }
    }
    
    kickMember(member, reason = '', forced = true) {
        if (this.isLeader(member)) {
            if (this.members.length == 1) { // if no one else left
                this.leader = null;
            }
            else {
                // find the first member to become the new party leader
                this.leader = this.members.find(m => m != member);
            }
        }
        this.members.splice(this.members.indexOf(member), 1);
        member.onPartyLeave(this, reason, forced);
        member.party = null;
        
        // delete the party ID if everyone left
        if (this.members.length == 0)
            this.delete();
    }
    
    disband() {
        this.members.forEach(member => this.kickMember(member, 'party disbanded', true));
    }
    
    delete() {
        delete global.parties[this.partyid];
    }
    
    setLeader(leader) {
        this.leader = leader;
    }
    
    isLeader(member) {
        return this.leader == member;
    }
    k;
    isMember(client) {
        return this.members.includes(client);
    }
    
    getAvgMMR() {
        if (this.members.length == 0)
            return 0;
        return this.members.reduce((v, m) => v + m.mmr, 0) / this.members.length;
    }
    
    get mmr() {
        return this.getAvgMMR();
    }
    
    
    getInfo() {
        return {
            partyid: this.partyid,
            members: this.members.map(m => m.name),
            leader: this.leader.name
        };
    }
}
;
