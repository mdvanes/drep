import { Command } from '@oclif/core';
import { FpLogger, checkDuplicateRtkqNames } from '../util/check-duplicate-rtkq-names.js';
import { drepArt, drepTagline } from '../util/drep-art.js';

export default class Run extends Command {
  static override description = 'Find duplicate Redux Toolkit Query endpoints.';

  static override examples = ['<%= config.bin %> <%= command.id %>'];

  public async run(): Promise<void> {
    this.log(drepArt);
    this.log(drepTagline);

    const fpLogger: FpLogger = {
      log: (...args: string[]) => this.log(...args),
      warn: (...args: string[]) => this.log(...args),
      error: (...args: string[]) => this.log(...args),
      logToStderr: (...args: string[]) => this.log(...args),
    };

    checkDuplicateRtkqNames(fpLogger);
  }
}
