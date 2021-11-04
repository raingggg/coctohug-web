let _sequelize  = null;

function getConnection() {
    if (_sequelize ) {
        return _sequelize 
    } else {
        const _sequelize  = new Sequelize({
            dialect: 'sqlite',
            storage: '~/.coctohug-web/db/coctohug.sqlite',
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        });

        return _sequelize ;
    }
}