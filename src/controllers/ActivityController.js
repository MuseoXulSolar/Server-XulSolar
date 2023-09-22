const { Actividades } = require("../db.js");
const { Op } = require("sequelize");
const { uploadCloud, deleteFile } = require("../tools/tools.js");
const path = require("path");

const idAct = async (id) => {
  const found = await Actividades.findOne({ where: { id } })
  return found
}

const searchByName = async (name) => {
  const foundName = await Actividades.findAll({
    where: {
      name: {
        [Op.iLike]: `%${name}%`,
      }
    }
  })
  return foundName;
}


const postActivity = async ({ date, name, images, description, hora }) => {
  const found = await Actividades.findOne({ where: { name } });
  if (found) throw new Error("ya existe esa actividad")
  let pathImg = 'imagen generica'
  if (images.length) {
    let nameImg = images[0].originalname
    let result = await uploadCloud(images[0].path, nameImg)
    result && (pathImg = result.url)
    const rutaCompleta = path.resolve(
      __dirname,
      "../public/uploads",
      nameImg
    );
    deleteFile(rutaCompleta)
  }
  const createActivity = await Actividades.create({ date, name, image: pathImg, description, hora });
  return createActivity
}

const allActivity = async () => {
  const activities = await Actividades.findAll();
  return activities;
}

const editActivity = async ({ id, name, date, image, description }) => {
  //* Buscar la actividad por su ID
  const activity = await Actividades.findByPk(id);

  if (!activity) {
    throw new Error("Actividad no encontrada");
  }

  //* Actualizar las propiedades de la actividad
  activity.name = name;
  activity.date = date;
  activity.image = image;
  activity.description = description;

  //* Guardar los cambios en la base de datos
  await activity.save();

  return activity;
}

const deleteLogic = async (id) => {
  const deletee = await Actividades.destroy({ where: { id } });
  return deletee;
}

const restoreLogic = async (id) => {
  const restores = await Actividades.restore({ where: { id } });
  return restores;
}
module.exports = {
  postActivity,
  allActivity,
  editActivity,
  deleteLogic,
  restoreLogic,
  searchByName,
  idAct
};