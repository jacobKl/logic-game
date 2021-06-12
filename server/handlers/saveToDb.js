const Database = require("../components/Database");

function saveToDb(io, data) {
  DB.getFreeId().then((id) => {
    DB.dbInsert({ ...data, id: id });
  });
}

module.exports = {
  saveToDb,
};
