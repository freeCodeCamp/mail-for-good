const db = require('../../models');

module.exports = () => {
  const { sequelize } = db;
  
  sequelize.sync({force:false})
  .then(createDefaultAdminIfNeeded())
};

async function createDefaultAdminIfNeeded() {
   const anAdmin = await db.user.findOne({where:{isAdmin:true}})
   if(anAdmin === null){
     db.user.createOne({
       email:'admin@admin.com',
       name:'admin',
       password:'admin',
       isAdmin:true
     })
   }
}
