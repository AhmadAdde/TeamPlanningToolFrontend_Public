const PersonData = [
  {
    id: "1",
    username: "najiib@username",
    firstname: "Najiib",
    lastname: "Abdi Dahir",
    team: "frontend",
  },
  {
    id: "2",
    username: "patrik@username",
    firstname: "Patrik",
    lastname: "Lind Amigo",
    team: "frontend",
  },
  {
    id: "3",
    username: "ahmad@username",
    firstname: "Ahmad",
    lastname: "Al Khateeb",
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
