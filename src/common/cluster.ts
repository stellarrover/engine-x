import { Logger } from '@nestjs/common';
import cluster from 'cluster';
import os from 'os';
export async function BootStrap(instance: {
  logger: Logger;
  start: () => Promise<void>;
}) {
  if (!instance) return;

  instance.logger.log('🚀 Server starting...');
  if (process.env.CLUSTER_ENABLE === 'true') {
    const cupCounts = os.cpus()?.length;
    instance.logger.log(`cpu count is :${cupCounts}`);
    if (cluster.isPrimary) {
      instance.logger.log(`main worker ${process.pid} start`);
      for (let i = 0; i < cupCounts; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker, code, signal) => {
        if (signal) {
          instance.logger.error(
            `worker  ${worker.process.pid} is killed by ${signal}`,
          );
        } else if (code !== 0) {
          instance.logger.error(
            `worker  ${worker.process.pid} is killed by code:${code}`,
          );
        } else {
          instance.logger.error(`worker  ${worker.process.pid} die`);
        }
        cluster.fork();
      });
    } else {
      instance.logger.log(`worker ${process.pid} start`);
      instance.start();
    }
  } else {
    instance.logger.log('no cluster');
    await instance.start();
    process.on('uncaughtException', (error, origin) => {
      instance.logger.error(
        `uncaughtException:${error.toString()}, ${origin.toString()}`,
      );
    });
    process.on('unhandledRejection', (reason: any) => {
      instance.logger.error(`unhandledRejection:${reason.toString()}`);
    });
  }
  instance.logger.log(
    `🚀 Server ready at http://localhost:${process.env.PORT || '4000'}/graphql`,
  );
}
