

class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, roomName, point) {
    let user = {id, name, room:{name:roomName,question:false,role:'player',answer:' '}, point:0};
    this.users.push(user);
    return user;
  }

  getUserList (room) {
    let users = this.users.filter((user) => user.room.name === room);
    let namesArray = users.map((user) => user.name);

    return namesArray;
  }

  getUser(id) {
    return this.users.filter((user) => user.id === id)[0];
  }

  removeUser(id) {
    let user = this.getUser(id);

    if(user){
      this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
  }

  addPoint (id) {
    let user = this.getUser(id);
      user.point = user.point + 10
    return user
  }
  getRoom(room){
    let users = this.users.filter((user) => user.room.name === room);

    return users

  }
}

module.exports = {Users};
