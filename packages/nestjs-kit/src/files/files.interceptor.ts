import {Observable} from 'rxjs';
import {ExecutionContext, Inject, Injectable, NestInterceptor, Optional, mixin} from '@nestjs/common';
import {FILES_MODULE_STORAGE_SERVICE} from './files.constants';

type MulterInstance = any;

export function FilesInterceptor(
    fieldName: string,
) {
    class MixinInterceptor implements NestInterceptor {
        public readonly upload: MulterInstance;

        constructor(@Inject(FILES_MODULE_STORAGE_SERVICE) private readonly storageService) {
        }

        public async intercept(
            context: ExecutionContext,
            call$: Observable<any>,
        ): Promise<Observable<any>> {
            const ctx = context.switchToHttp();

            await new Promise((resolve, reject) => {
                return this.storageService.storage.uploadMultiple(fieldName)(
                    ctx.getRequest(),
                    ctx.getResponse(),
                    (err) => {
                        if (err) {
                            // const error = transformException(err);
                            return reject(err);
                        }
                        resolve();
                    },
                );
            });
            return call$;
        }
    }

    const Interceptor = mixin(MixinInterceptor);
    return Interceptor;
}
