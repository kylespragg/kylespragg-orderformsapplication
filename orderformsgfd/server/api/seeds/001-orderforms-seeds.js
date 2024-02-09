
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('orderforms').truncate()
  await knex('orderforms').insert([
    {
      name: 'Item 1',
      quantity: '10',
      status: 'Available',
      type: 'Type A',
    },
    {
      name: 'Item 2',
      quantity: '5',
      status: 'Out of Stock',
      type: 'Type B',
    },
    {
      name: 'Item 3',
      quantity: '8',
      status: 'Available',
      type: 'Type A',
    },
    {
      name: 'Item 4',
      quantity: '3',
      status: 'Out of Stock',
      type: 'Type C',
    },
  ]);
};
