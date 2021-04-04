#!/usr/bin/env node
require = require('esm')(module);

const { MigrationService } = require('../lib/migration-service');

/** @type {import('yargs').CommandModule[]} */
const commands = [
  {
    command: 'create <module> <filename>',
    aliases: 'new',
    describe: 'Create a new migration file for the given module.',
    handler: async argv => {
      const filepath = await MigrationService.create(argv.module, argv.filename);
      console.log(`Migration file created in '${filepath}'`);
    },
  },
  {
    command: 'list <module>',
    aliases: 'ls',
    describe: 'Lists the migration files of a given module.',
    handler: argv => console.log(MigrationService.list(argv.module)),
  },
  {
    command: 'migrate [module]',
    aliases: 'm',
    describe: 'Migrates the given module if provided, and all modules if none.',
    handler: async argv => {
      const { module } = argv;
      await MigrationService.migrate(module);
      console.log(`Migrated ${module ? `'${module}' module` : 'all modules'}.`);
      process.exit(1);
    },
  },
  {
    command: 'rollback [module]',
    aliases: 'r',
    describe: 'Rollbacks the given module if provided, and all modules if none.',
    handler: async argv => {
      const { module } = argv;
      await MigrationService.rollback(module);
      console.log(`Rollbacked ${module ? `'${module}' module` : 'all modules'}.`);
      process.exit(1);
    }
  },
  {
    command: 'up <module> [migration]',
    aliases: 'u',
    describe: 'Migrates up a given module.\n'
      + 'If a migration filename is provided, the module is migrated up until the given migration.',
    handler: async argv => {
      try {
        const result = await MigrationService.up(argv.module, argv.migration);
        // TODO: Make proper output.
        console.log(result);
        process.exit(1);
      }
      catch(error) {
        console.error(error);
      }
    },
  },
  {
    command: 'down <module> [migration]',
    aliases: 'd',
    // down: MigrationService.down,
    describe: 'Migrates down a given module.\n'
      + 'If a migration filename is provided, the module is migrated down to the given migration.',
    handler: async argv => {
      try {
        const result = await MigrationService.down(argv.module, argv.migration);
        // TODO: Make proper output.
        console.log(result);
        process.exit(1);
      }
      catch(error) {
        console.error(error);
      }
    },
  },
];

require('yargs')
  .scriptName('schemate')
  .command(commands)
  .fail((message, error, yargs) => {
    console.error('Error: Missing arguments.\n\n', yargs.help());
    process.exit(1);
  })
  .argv;
