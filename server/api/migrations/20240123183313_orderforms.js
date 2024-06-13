exports.up = async knex => {
    await knex.schema.createTable('orderforms', tbl => {
        tbl.increments(); //good for id tracking, we don't necessarily need
        tbl.text('name', 256).notNullable();
        tbl.text('quantity', 256).notNullable();
        tbl.text('status', 256).notNullable();
        tbl.text('type', 256).notNullable();
        tbl.timestamp('postDate').defaultTo(knex.fn.now()); // Automatically populates postDate if not given one
    })
  
};

exports.down = async knex => {
    await knex.schema.dropTableIfExists('orderforms');
  
};

// if you need to reset the table --> npx knex migrate:rollback --> This will delete the previous columns
// run npx knex migrate:latest after editing data --> this creates the table format for us
// run npx knex seed:make 001-orderforms-seeds --> test data
// after editing, run npx knex seed:run
