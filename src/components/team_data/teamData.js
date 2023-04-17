const PersonData = [
  {
    id: 0,
    username: "najiib@username",
    firstname: "Najiib",
    lastname: "Abdi Dahir",
    team: "frontend",
  },
  {
    id: 1,
    username: "patrik@username",
    firstname: "Patrik",
    lastname: "Lind Amigo",
    team: "frontend",
  },
  {
    id: 2,
    username: "ahmad@username",
    firstname: "Ahmad",
    lastname: "Al Khateeb",
    team: "frontend",
  },
  {
    id: 3,
    username: "user@fasdsa",
    firstname: "Hejsan",
    lastname: "Då",
    team: "frontend",
  },
  {
    id: 4,
    username: "user2@fadsad",
    firstname: "Hejdå",
    lastname: "Ren",
    team: "frontend",
  },
];

class DataService {
  getPersons() {
    return PersonData;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new DataService();
