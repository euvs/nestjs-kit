import {Schema} from 'mongoose';

export const updateTimePlugin = (schema: Schema) => {
    schema.add({ updatedAt: Date });
    schema.add({ createdAt: Date });

    schema.pre('save', function(next) {
        // @ts-ignore
        if (!this.createdAt) {
            // @ts-ignore
            this.createdAt = new Date();
        }
        // @ts-ignore
        this.updatedAt = new Date();
        next();
    });

    // if (options && options.index) {
    //     schema.path('updatedAt').index(options.index);
    //     schema.path('createdAt').index(options.index);
    // }
};
