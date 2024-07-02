import { Sequelize } from "sequelize";

const sequelize = new Sequelize('railway', 'root', 'RYqAfZRcoxbfqcGeosINSKINpTpGdfYN', {
  host: 'monorail.proxy.rlwy.net',
  port: 43489,
  dialect: 'mysql',
});

export default sequelize;
